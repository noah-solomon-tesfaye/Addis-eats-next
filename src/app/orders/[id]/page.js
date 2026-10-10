import { redirect } from "next/navigation";
import OrderStatus from "../OrderStatus";
import { getSession } from "../../../lib/session";
import { getOrderForUser } from "../../../lib/orders";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: "Order Status",
    description: "View the status of your Addis Eats food order.",
    alternates: {
      canonical: `/orders/${id}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OrderPage({ params }) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/signin?next=/orders");
  }

  const { id } = await params;
  const order = getOrderForUser(id, session.user.id);

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl py-12">
        <p className="text-red-600">Order not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl py-12">
      <h1 className="mb-6 text-3xl font-bold">
        Order Status
      </h1>

      <OrderStatus id={id} initial={order} />
    </main>
  );
}