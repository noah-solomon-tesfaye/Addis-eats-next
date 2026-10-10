"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/" })}
      className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
    >
      Sign Out
    </button>
  );
}