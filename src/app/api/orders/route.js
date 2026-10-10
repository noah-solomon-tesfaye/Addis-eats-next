import { getSession } from "../../../lib/session";
import {
  getOrdersForUser,
  createOrderForUser,
} from "../../../lib/orders";
import { getDishes } from "../../../lib/dishes";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return Response.json({
    orders: getOrdersForUser(session.user.id),
  });
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
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const requestedItems = body.items;

  if (name.length < 2 || name.length > 100) {
    return Response.json(
      { error: "Please enter a valid name." },
      { status: 400 }
    );
  }

  if (!/^[+0-9()\-\s]{7,20}$/.test(phone)) {
    return Response.json(
      { error: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  if (
    !Array.isArray(requestedItems) ||
    requestedItems.length === 0 ||
    requestedItems.length > 50
  ) {
    return Response.json(
      { error: "Your cart is empty or invalid." },
      { status: 400 }
    );
  }

  const dishes = await getDishes();
  const items = [];

  for (const requestedItem of requestedItems) {
    if (
      !requestedItem ||
      typeof requestedItem.id !== "string" ||
      !Number.isInteger(requestedItem.quantity) ||
      requestedItem.quantity < 1 ||
      requestedItem.quantity > 50
    ) {
      return Response.json(
        { error: "One or more cart items are invalid." },
        { status: 400 }
      );
    }

    const dish = dishes.find(
      (item) => item.id === requestedItem.id
    );

    if (!dish || !Number.isFinite(dish.price) || dish.price < 0) {
      return Response.json(
        { error: "One or more menu items are unavailable." },
        { status: 400 }
      );
    }

    items.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: requestedItem.quantity,
    });
  }

  const order = createOrderForUser(session.user.id, {
    name,
    phone,
    items,
  });

  if (!order) {
    return Response.json(
      { error: "Unable to create your order." },
      { status: 400 }
    );
  }

  return Response.json(
    { order },
    { status: 201 }
  );
}