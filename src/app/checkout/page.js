import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
  description:
    "Complete your Addis Eats food order by providing your delivery details.",
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/signin?next=%2Fcheckout");
  }

  return (
    <main className="min-h-[70vh]">
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a86f2b]">
            Almost there
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#29443a] sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#73766f] sm:text-base">
            Complete your order, {session.user?.name || "customer"}.
          </p>
        </div>

        <CheckoutForm customerName={session.user?.name || ""} />

        <div className="mt-6">
          <Link
            href="/menu"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
          >
            ← Back to menu
          </Link>
        </div>
      </section>
    </main>
  );
}