"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "📊",
  },
  {
    href: "/menu-management",
    label: "Menu Management",
    icon: "🍽️",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
      {/* Sidebar header */}
      <div className="shrink-0 border-b border-gray-200 p-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-orange-700 transition hover:text-orange-800"
        >
          🍴 Addis Eats
        </Link>

        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-row gap-2 overflow-x-auto p-4 lg:flex-1 lg:flex-col lg:overflow-x-visible">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-orange-100 text-orange-800"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {link.icon}
              </span>

              <span>{link.label}</span>
            </Link>
          );
        })}

        {/* Return to the customer website */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <span className="text-lg" aria-hidden="true">
            🌐
          </span>

          <span>Visit Website</span>
        </Link>
      </nav>

      {/* Sign out */}
      <div className="shrink-0 border-t border-gray-200 p-4">
        <SignOutButton />
      </div>
    </aside>
  );
}