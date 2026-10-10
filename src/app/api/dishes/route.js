import { getDishes } from "@/lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim().toLowerCase() || "";
  const category = searchParams.get("category")?.trim().toLowerCase() || "";
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isFinite(pageParam) ? Math.max(1, pageParam) : 1;

  const dishes = await getDishes();

  // Filter by category first.
  const categoryFiltered = dishes.filter((dish) => {
    return !category || category === "all" || dish.category === category;
  });

  // Search dish names and descriptions.
  const filteredDishes = categoryFiltered.filter((dish) => {
    if (!query) return true;

    return (
      dish.name.toLowerCase().includes(query) ||
      dish.description.toLowerCase().includes(query)
    );
  });

  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const pagedDishes = filteredDishes.slice(start, start + pageSize);

  return Response.json({
    dishes: pagedDishes,
    page,
    pageSize,
    total: filteredDishes.length,
    totalPages: Math.ceil(filteredDishes.length / pageSize),
  });
}