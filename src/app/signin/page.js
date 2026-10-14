import { redirect } from "next/navigation";
import { signIn } from "../../../auth";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to Addis Eats to continue to your food order.",
  alternates: {
    canonical: "/signin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const requestedNext = params?.next ?? "/";

  // Only allow local application paths as redirect destinations.
  const next =
    typeof requestedNext === "string" &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
      ? requestedNext
      : "/";

  async function handleCredentialsSignIn(formData) {
    "use server";

    const phone = formData.get("phone");
    const password = formData.get("password");

    if (
      typeof phone !== "string" ||
      typeof password !== "string" ||
      !phone.trim() ||
      !password
    ) {
      redirect(`/signin?next=${encodeURIComponent(next)}`);
    }

    await signIn("credentials", {
      phone: phone.trim(),
      password,
      redirectTo: next,
    });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            Addis Eats
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-3 text-gray-600">
            Sign in to continue to your food order.
          </p>
        </div>

        <form action={handleCredentialsSignIn} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold"
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <button
            type="submit"
            className="min-h-11 w-full rounded-lg bg-gray-950 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          By signing in, you can access your orders and continue
          your Addis Eats experience.
        </p>
      </div>
    </main>
  );
}