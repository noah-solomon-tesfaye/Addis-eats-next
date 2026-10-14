import { getSession } from "../../../../../lib/session";
import { getOrderForUser } from "../../../../../lib/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_INTERVAL_MS = 3000;
const TERMINAL_STATUSES = new Set(["delivered", "cancelled"]);

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  let order;

  try {
    order = await getOrderForUser(id, session.user.id);
  } catch (error) {
    console.error("Failed to load tracked order:", error);

    return Response.json(
      { error: "Unable to load order." },
      { status: 500 }
    );
  }

  if (!order) {
    return Response.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  const encoder = new TextEncoder();
  let intervalId;
  let closed = false;
  let lastStatus = order.status;
  let checking = false;

  const stream = new ReadableStream({
    start(controller) {
      function sendEvent(event, data) {
        if (closed) return;

        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
            )
          );
        } catch {
          closeStream();
        }
      }

      function closeStream() {
        if (closed) return;

        closed = true;

        if (intervalId) {
          clearInterval(intervalId);
        }

        request.signal.removeEventListener("abort", handleAbort);

        try {
          controller.close();
        } catch {
          // The stream may already be closed by the client.
        }
      }

      function handleAbort() {
        closeStream();
      }

      request.signal.addEventListener("abort", handleAbort, {
        once: true,
      });

      sendEvent("order", order);

      if (TERMINAL_STATUSES.has(order.status)) {
        closeStream();
        return;
      }

      intervalId = setInterval(async () => {
        if (closed || checking) return;

        checking = true;

        try {
          const currentOrder = await getOrderForUser(
            id,
            session.user.id
          );

          if (closed) return;

          if (!currentOrder) {
            sendEvent("error", {
              message: "Order not found.",
            });

            closeStream();
            return;
          }

          if (currentOrder.status !== lastStatus) {
            lastStatus = currentOrder.status;

            sendEvent("order", currentOrder);
          }

          if (TERMINAL_STATUSES.has(currentOrder.status)) {
            closeStream();
          }
        } catch (error) {
          console.error("Failed to refresh tracked order:", error);

          sendEvent("error", {
            message: "Unable to refresh order status.",
          });

          closeStream();
        } finally {
          checking = false;
        }
      }, POLL_INTERVAL_MS);
    },

    cancel() {
      closed = true;

      if (intervalId) {
        clearInterval(intervalId);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}