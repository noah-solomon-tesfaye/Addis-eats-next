"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartNavLink from "./CartNavLink";
import SignOutButton from "./SignOutButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "My Orders" },
];

function NavigationLink({ href, label, onNavigate }) {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-[#f3ede3] text-[#29443a]"
          : "text-[#454941] hover:bg-[#faf8f3] hover:text-[#29443a]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Desktop navigation */}
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-1 md:flex lg:gap-2"
      >
        {links.map((link) => (
          <NavigationLink key={link.href} {...link} />

        ))}

        <CartNavLink />

        <Link
          href="/checkout"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#29443a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#20372e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
        >
          Checkout
        </Link>

        <SignOutButton />
      </nav>

      {/* Mobile hamburger button */}
      <div className="relative md:hidden">
        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#e9e2d7] bg-white text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
        >
          <span className="sr-only">
            {isOpen ? "Close menu" : "Open menu"}
          </span>

          <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        {/* Mobile dropdown */}
        {isOpen && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="fixed inset-0 z-40 cursor-default bg-black/20"
            />

            <div
              id="mobile-navigation-menu"
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-[#e9e2d7] bg-white p-3 shadow-xl"
            >
              <nav aria-label="Mobile navigation" className="space-y-1">
                {links.map((link) => (
                  <NavigationLink
                    key={link.href}
                    {...link}
                    onNavigate={closeMenu}
                  />
                ))}

                <div
                  onClick={closeMenu}
                  className="flex min-h-12 items-center rounded-xl px-1"
                >
                  <CartNavLink />
                </div>

                <Link
                  href="/checkout"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-[#29443a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20372e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
                >
                  Checkout
                </Link>

                <div className="border-t border-[#e9e2d7] pt-2">
                  <SignOutButton />
                </div>
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  );
}