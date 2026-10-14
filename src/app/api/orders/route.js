import { getSession } from "../../../lib/session";
import {
  createOrderForUser,
  getOrdersForUser,
} from "../../../lib/orders";
import { getDishes } from "../../../lib/dishes";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const orders = await getOrdersForUser(session.user.id);

    return Response.json({ orders });
  } catch (error) {
    console.error("Failed to retrieve orders:", error);

    return Response.json(
      { error: "Unable to retrieve orders." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { name, phone, items, neighbourhood } = body ?? {};

  if (typeof name !== "string" || name.trim().length < 2) {
    return Response.json(
      { error: "Please provide a valid name." },
      { status: 400 }
    );
  }

  if (
    typeof phone !== "string" ||
    !/^[+0-9()\-*\s]{7,20}$/.test(phone.trim())
  ) {
    return Response.json(
      { error: "Please provide a valid phone number." },
      { status: 400 }
    );
  }

  if (
    typeof neighbourhood !== "string" ||
    neighbourhood.trim().length < 2 ||
    neighbourhood.trim().length > 100
  ) {
    return Response.json(
      { error: "Please provide a valid neighbourhood." },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json(
      { error: "Your order must contain at least one item." },
      { status: 400 }
    );
  }

  // Load the menu using the existing getDishes() function.
  let menu;

  try {
    menu = await getDishes();
  } catch (error) {
    console.error("Failed to retrieve menu:", error);

    return Response.json(
      { error: "Unable to validate menu items." },
      { status: 500 }
    );
  }

  const validatedItems = [];

  for (const item of items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      return Response.json(
        { error: "One or more order items are invalid." },
        { status: 400 }
      );
    }

    const dish = menu.find((entry) => entry.id === item.id);

    if (!dish) {
      return Response.json(
        { error: "One or more selected dishes could not be found." },
        { status: 400 }
      );
    }

    validatedItems.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: item.quantity,
    });
  }

  try {
    const order = await createOrderForUser(session.user.id, {
      items: validatedItems,
      neighbourhood: neighbourhood.trim(),
    });

    if (!order) {
      return Response.json(
        { error: "Unable to create your order." },
        { status: 400 }
      );
    }

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);

    return Response.json(
      { error: "Unable to save your order." },
      { status: 500 }
    );
  }
}