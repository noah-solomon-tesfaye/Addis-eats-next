"use client";

import { useState } from "react";

export default function DemoLoginButtons() {
  const [selectedRole, setSelectedRole] = useState("");

  const accounts = [
    {
      name: "Customer",
      icon: "👤",
      phone: "0911000000",
      password: "AddisEats123!",
      description: "Order your favorite Ethiopian food",
      role: "customer",
      destination: "/",
    },
    {
      name: "Administrator",
      icon: "🛡️",
      phone: "0900000000",
      password: "AdminChangeMe123!",
      description: "Manage the restaurant and menu",
      role: "admin",
      destination: "/dashboard",
    },
    {
      name: "Kitchen Staff",
      icon: "🍳",
      phone: "0912000000",
      password: "KitchenChangeMe123!",
      description: "Manage kitchen orders",
      role: "staff",
      destination: "/kitchen",
    },
  ];

  function fillCredentials(account) {
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const nextInput = document.querySelector('input[name="next"]');

    if (!phoneInput || !passwordInput) {
      return;
    }

    // Fill in the selected demo account.
    phoneInput.value = account.phone;
    passwordInput.value = account.password;

    // Set the destination for this account.
    if (nextInput) {
      nextInput.value = account.destination;
    }

    setSelectedRole(account.role);

    // Focus the password-independent phone field.
    phoneInput.focus();
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {accounts.map((account) => {
        const selected = selectedRole === account.role;

        return (
          <button
            key={account.role}
            type="button"
            onClick={() => fillCredentials(account)}
            aria-pressed={selected}
            className={`w-full rounded-xl border p-4 text-left transition duration-200 ${
              selected
                ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-secondary)]"
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[var(--foreground)]">
                {account.icon} {account.name}
              </span>

              <span
                className={`text-sm font-semibold ${
                  selected
                    ? "text-orange-700"
                    : "text-[var(--primary)]"
                }`}
              >
                {selected ? "Selected ✓" : "Use account →"}
              </span>
            </span>

            <span className="mt-2 block text-sm text-[var(--muted)]">
              {account.phone}
            </span>

            <span className="mt-1 block text-xs text-[var(--muted)]">
              {account.description}
            </span>
          </button>
        );
      })}

      <p className="mt-2 text-center text-xs text-[var(--muted)]">
        Select an account to fill the login form, then click Sign In.
      </p>
    </div>
  );
}