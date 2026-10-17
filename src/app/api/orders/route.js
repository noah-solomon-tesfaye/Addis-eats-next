import { getSession } from "../../../lib/session";
import {
  createOrderForUser,
  getOrdersForUser,
} from "../../../lib/orders";
import { getDishes } from "../../../lib/dishes";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders
 * Retrieve orders belonging to the signed-in user.
 */
export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized. Please sign in to view your orders." },
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

/**
 * POST /api/orders
 * Create an order after validating customer information and
 * checking every requested dish against the current menu.
 */
export async function POST(request) {
  // 1. Require authentication.
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized. Please sign in before placing an order." },
      { status: 401 }
    );
  }

  // 2. Parse the request body.
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

  // 3. Validate the customer's name.
  if (typeof name !== "string" || name.trim().length < 2) {
    return Response.json(
      { error: "Please provide a valid name." },
      { status: 400 }
    );
  }

  // 4. Validate the customer's phone number.
  if (
    typeof phone !== "string" ||
    !/^[+0-9()\-*\s]{7,20}$/.test(phone.trim())
  ) {
    return Response.json(
      { error: "Please provide a valid phone number." },
      { status: 400 }
    );
  }

  // 5. Validate the delivery neighbourhood.
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

  // 6. Validate the cart.
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json(
      { error: "Your order must contain at least one item." },
      { status: 400 }
    );
  }

  // Prevent unnecessarily large requests.
  if (items.length > 100) {
    return Response.json(
      { error: "Your order contains too many different items." },
      { status: 400 }
    );
  }

  // 7. Load the latest menu from the server.
  let menu;

  try {
    menu = await getDishes();
  } catch (error) {
    console.error("Failed to retrieve menu:", error);

    return Response.json(
      { error: "Unable to validate menu items. Please try again." },
      { status: 500 }
    );
  }

  const validatedItems = [];

  // 8. Validate each cart item against the current menu.
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

    // Use the server's menu data, not prices or names supplied by the client.
    const dish = menu.find((entry) => entry.id === item.id);

    if (!dish) {
      return Response.json(
        {
          error:
            "A selected dish could not be found. Please refresh your menu and try again.",
        },
        { status: 400 }
      );
    }

    // IMPORTANT: Reject unavailable dishes.
    if (dish.available === false) {
      return Response.json(
        {
          error: `${dish.name} is currently unavailable. Please remove it from your cart and choose another dish.`,
          unavailableDishId: dish.id,
        },
        { status: 400 }
      );
    }

    // Validate the server-side price.
    if (
      typeof dish.price !== "number" ||
      !Number.isFinite(dish.price) ||
      dish.price < 0
    ) {
      console.error("Invalid price for dish:", dish.id);

      return Response.json(
        { error: "A selected dish has an invalid price. Please contact us." },
        { status: 500 }
      );
    }

    // Save only trusted menu data in the order.
    validatedItems.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: item.quantity,
    });
  }

  // 9. Create the order using validated items.
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
      { error: "Unable to save your order. Please try again." },
      { status: 500 }
    );
  }
}