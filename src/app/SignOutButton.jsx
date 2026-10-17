"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      sessionStorage.setItem(
        "addis-eats-signout-message",
        "You have successfully signed out."
      );
    } catch {
      // Redirect still works if storage is unavailable.
    }

    await signOut({ redirectTo: "/signin" });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-[var(--secondary)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-wait disabled:opacity-60"
    >
      {signingOut ? "Signing out…" : "Sign Out"}
    </button>
  );
}