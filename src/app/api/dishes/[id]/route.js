import { getSession } from "@/lib/session";
import {
  getDishById,
  updateDish,
  deleteDish,
} from "@/lib/dishes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getId(context) {
  const params = await context.params;
  return params.id;
}

async function authorizeAdmin() {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      error: Response.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      error: Response.json(
        { error: "Forbidden. Administrator access is required." },
        { status: 403 }
      ),
    };
  }

  return { authorized: true };
}

function validateUpdate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Invalid dish data.";
  }

  const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "image",
    "isFasting",
    "spiceLevel",
    "ingredients",
    "discountPer",
    "available",
  ];

  const hasAllowedField = Object.keys(body).some((key) =>
    allowedFields.includes(key)
  );

  if (!hasAllowedField) {
    return "No valid fields provided to update.";
  }

  if (
    "name" in body &&
    (typeof body.name !== "string" || !body.name.trim())
  ) {
    return "Name cannot be empty.";
  }

  if (
    "description" in body &&
    (typeof body.description !== "string" ||
      !body.description.trim())
  ) {
    return "Description cannot be empty.";
  }

  if (
    "price" in body &&
    (typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0)
  ) {
    return "Price must be a non-negative number.";
  }

  if (
    "category" in body &&
    (typeof body.category !== "string" ||
      !body.category.trim())
  ) {
    return "Category cannot be empty.";
  }

  if (
    "available" in body &&
    typeof body.available !== "boolean"
  ) {
    return "Availability must be true or false.";
  }

  if (
    "isFasting" in body &&
    typeof body.isFasting !== "boolean"
  ) {
    return "Fasting status must be true or false.";
  }

  if (
    "image" in body &&
    typeof body.image !== "string"
  ) {
    return "Image must be a string.";
  }

  if (
    "spiceLevel" in body &&
    typeof body.spiceLevel !== "string"
  ) {
    return "Spice level must be a string.";
  }

  if (
    "ingredients" in body &&
    (!Array.isArray(body.ingredients) ||
      !body.ingredients.every(
        (ingredient) => typeof ingredient === "string"
      ))
  ) {
    return "Ingredients must be a list of strings.";
  }

  if (
    "discountPer" in body &&
    (typeof body.discountPer !== "number" ||
      !Number.isFinite(body.discountPer) ||
      body.discountPer < 0 ||
      body.discountPer > 100)
  ) {
    return "Discount must be between 0 and 100.";
  }

  return null;
}

// GET /api/dishes/[id]
export async function GET(_request, context) {
  try {
    const id = await getId(context);
    const dish = await getDishById(id);

    if (!dish) {
      return Response.json(
        { error: "Dish not found." },
        { status: 404 }
      );
    }

    return Response.json({ dish });
  } catch (error) {
    console.error("GET individual dish error:", error);

    return Response.json(
      { error: "Could not retrieve the dish." },
      { status: 500 }
    );
  }
}

// PATCH /api/dishes/[id]
export async function PATCH(request, context) {
  const authorization = await authorizeAdmin();

  if (authorization.error) {
    return authorization.error;
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

  const validationError = validateUpdate(body);

  if (validationError) {
    return Response.json(
      { error: validationError },
      { status: 400 }
    );
  }

  const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "image",
    "isFasting",
    "spiceLevel",
    "ingredients",
    "discountPer",
    "available",
  ];

  const updates = Object.fromEntries(
    Object.entries(body).filter(([key]) =>
      allowedFields.includes(key)
    )
  );

  for (const key of [
    "name",
    "description",
    "category",
    "image",
    "spiceLevel",
  ]) {
    if (typeof updates[key] === "string") {
      updates[key] = updates[key].trim();
    }
  }

  if (Array.isArray(updates.ingredients)) {
    updates.ingredients = updates.ingredients.map((item) =>
      item.trim()
    );
  }

  try {
    const id = await getId(context);
    const dish = await updateDish(id, updates);

    if (!dish) {
      return Response.json(
        { error: "Dish not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Dish updated successfully.",
      dish,
    });
  } catch (error) {
    console.error("PATCH individual dish error:", error);

    return Response.json(
      { error: "Could not update the dish." },
      { status: 500 }
    );
  }
}

// DELETE /api/dishes/[id]
export async function DELETE(_request, context) {
  const authorization = await authorizeAdmin();

  if (authorization.error) {
    return authorization.error;
  }

  try {
    const id = await getId(context);
    const deleted = await deleteDish(id);

    if (!deleted) {
      return Response.json(
        { error: "Dish not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Dish deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE individual dish error:", error);

    return Response.json(
      { error: "Could not delete the dish." },
      { status: 500 }
    );
  }
}