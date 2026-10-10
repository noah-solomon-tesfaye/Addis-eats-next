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

  async function handleGoogleSignIn() {
    "use server";

    await signIn("google", {
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

        <form action={handleGoogleSignIn} className="mt-8">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.93 46.98 31.73 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            Continue with Google
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">
            or sign in with phone
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form action={handleCredentialsSignIn} className="space-y-4">
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
            className="w-full rounded-lg bg-gray-950 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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