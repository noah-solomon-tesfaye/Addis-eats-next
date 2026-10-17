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
    redirect("/signin?next=%2Forders");
  }

  const { id } = await params;

  const order = await getOrderForUser(id, session.user.id);

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p role="alert" className="text-red-600">
          Order not found.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold text-stone-900 sm:text-3xl">
        Order Status
      </h1>

      <OrderStatus id={id} initial={order} />
    </main>
  );
}