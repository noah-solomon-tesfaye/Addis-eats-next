import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DemoLoginButtons from "./DemoLoginButtons";

async function handleCredentialsSignIn(formData) {
  "use server";

  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const requestedNext = String(formData.get("next") || "/");

  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (!phone || !password) {
    redirect(
      `/signin?error=missing&next=${encodeURIComponent(next)}`
    );
  }

  try {
    await signIn("credentials", {
      phone,
      password,
      redirectTo: next,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/signin?error=invalid&next=${encodeURIComponent(next)}`
      );
    }

    throw error;
  }
}

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;

  const error = params?.error;
  const requestedNext = params?.next || "/";

  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  const signedOut = params?.signedOut === "true";

  return (
    <main className="min-h-[80vh] bg-[var(--background)] px-4 py-12 text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🍽️</div>

          <h1 className="text-3xl font-bold">
            Welcome to Addis Eats
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to enjoy delicious Ethiopian food.
          </p>
        </div>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg sm:p-8">
          {signedOut && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800"
            >
              You have successfully signed out.
            </div>
          )}

          {error === "invalid" && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              Invalid phone number or password. Please try again.
            </div>
          )}

          {error === "missing" && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
            >
              Please enter both your phone number and password.
            </div>
          )}

          <form action={handleCredentialsSignIn} className="space-y-5">
            <input type="hidden" name="next" value={next} />

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="username"
                placeholder="Enter your phone number"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-orange-200"
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
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />

            <span className="text-xs text-[var(--muted)]">
              OR TRY A DEMO ACCOUNT
            </span>

            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <DemoLoginButtons />

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            New to Addis Eats?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Addis Eats · Fresh food, delivered with care.
        </p>
      </div>
    </main>
  );
}