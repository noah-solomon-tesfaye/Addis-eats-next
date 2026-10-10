export async function GET(request, { params }) {
  const { id } = await params;

  if (id !== "ord_001") {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json({
    id,
    status: "preparing",
  });
}