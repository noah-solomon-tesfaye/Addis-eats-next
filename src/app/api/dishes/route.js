import { getSession } from "@/lib/session";
import { getDishes, createDish } from "@/lib/dishes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAdmin(session) {
  return Boolean(
    session?.user?.id && session.user.role === "admin"
  );
}

function validateDish(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Invalid dish data.";
  }

  if (typeof body.name !== "string" || !body.name.trim()) {
    return "Dish name is required.";
  }

  if (
    typeof body.description !== "string" ||
    !body.description.trim()
  ) {
    return "Description is required.";
  }

  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0
  ) {
    return "Price must be a non-negative number.";
  }

  if (typeof body.category !== "string" || !body.category.trim()) {
    return "Category is required.";
  }

  if (
    body.available !== undefined &&
    typeof body.available !== "boolean"
  ) {
    return "Availability must be true or false.";
  }

  if (
    body.isFasting !== undefined &&
    typeof body.isFasting !== "boolean"
  ) {
    return "Fasting status must be true or false.";
  }

  if (
    body.discountPer !== undefined &&
    (
      typeof body.discountPer !== "number" ||
      !Number.isFinite(body.discountPer) ||
      body.discountPer < 0 ||
      body.discountPer > 100
    )
  ) {
    return "Discount must be between 0 and 100.";
  }

  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query =
      (searchParams.get("q") || "").trim().toLowerCase();

    const category =
      (searchParams.get("category") || "").trim().toLowerCase();

    const getAll = searchParams.get("all") === "true";

    const parsedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );

    const page =
      Number.isFinite(parsedPage) && parsedPage > 0
        ? parsedPage
        : 1;

    const dishes = await getDishes();

    const filteredDishes = dishes.filter((dish) => {
      const matchesCategory =
        !category ||
        category === "all" ||
        dish.category === category;

      const matchesQuery =
        !query ||
        String(dish.name || "").toLowerCase().includes(query) ||
        String(dish.description || "").toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    // Return every matching dish when all=true.
    if (getAll) {
      return Response.json(
        {
          dishes: filteredDishes,
          page: 1,
          pageSize: filteredDishes.length,
          total: filteredDishes.length,
          totalPages: filteredDishes.length > 0 ? 1 : 0,
        },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    // Preserve pagination for the customer menu.
    const pageSize = 6;
    const start = (page - 1) * pageSize;

    return Response.json(
      {
        dishes: filteredDishes.slice(start, start + pageSize),
        page,
        pageSize,
        total: filteredDishes.length,
        totalPages: Math.ceil(filteredDishes.length / pageSize),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/dishes failed:", error);

    return Response.json(
      { error: "Could not retrieve dishes." },
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

  if (!isAdmin(session)) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON." },
      { status: 400 }
    );
  }

  const validationError = validateDish(body);

  if (validationError) {
    return Response.json(
      { error: validationError },
      { status: 400 }
    );
  }

  try {
    const dish = await createDish({
      name: body.name.trim(),
      description: body.description.trim(),
      price: body.price,
      category: body.category.trim(),
      image: typeof body.image === "string" ? body.image.trim() : "",
      isFasting: body.isFasting ?? false,
      spiceLevel:
        typeof body.spiceLevel === "string"
          ? body.spiceLevel
          : "Mild",
      ingredients: Array.isArray(body.ingredients)
        ? body.ingredients.filter(
            (ingredient) => typeof ingredient === "string"
          )
        : [],
      discountPer: body.discountPer ?? 0,
      available: body.available ?? true,
    });

    return Response.json({ dish }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes failed:", error);

    return Response.json(
      { error: error.message || "Could not create dish." },
      { status: 400 }
    );
  }
}