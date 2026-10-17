"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartNavLink from "./CartNavLink";
import SignOutButton from "./SignOutButton";

export default function MobileNavigation({
  role,
  authenticated,
}) {
  const pathname = usePathname();

  // Dashboard and staff pages use their own navigation.
  const hideNavigation = [
    "/dashboard",
    "/menu-management",
    "/kitchen",
  ].some(
    (path) =>
      pathname === path || pathname.startsWith(`${path}/`)
  );

  if (hideNavigation) {
    return null;
  }

  const customerLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    ...(authenticated
      ? [{ href: "/orders", label: "My Orders" }]
      : []),
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard" },
    {
      href: "/menu-management",
      label: "Menu Management",
    },
  ];

  const staffLinks = [
    { href: "/kitchen", label: "Kitchen Orders" },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "staff"
        ? staffLinks
        : customerLinks;

  return (
    <nav
      aria-label="Main navigation"
      className="min-w-0 flex-1 bg-transparent"
    >
      <div className="flex min-w-0 items-center justify-end gap-3">
        {/* Desktop navigation links */}
        <div className="hidden items-center gap-5 lg:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" &&
                pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)] hover:text-[var(--primary)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Cart */}
        {(!role || role === "customer") && (
          <CartNavLink />
        )}

        {/* Sign in or sign out */}
        {authenticated ? (
          <SignOutButton />
        ) : (
          <Link
            href="/signin"
            className="whitespace-nowrap rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile navigation links */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" &&
              pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--surface)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}