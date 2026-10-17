"use client";

import { useSyncExternalStore } from "react";

const MESSAGE_KEY = "addis-eats-signout-message";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("addis-eats-signout", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("addis-eats-signout", callback);
  };
}

function getSnapshot() {
  try {
    return sessionStorage.getItem(MESSAGE_KEY) || "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

export default function SignOutMessage() {
  const message = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!message) return null;

  return (
    <p
      role="status"
      className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
    >
      {message}
    </p>
  );
}