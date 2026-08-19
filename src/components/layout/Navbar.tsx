"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, UserRound } from "lucide-react";
import { useState } from "react";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const navigation = [
  {
    label: "Properties",
    href: "/properties",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1440px] px-4 pt-4 md:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between rounded-2xl border border-black/10 bg-white/95 px-5 shadow-sm backdrop-blur-xl md:px-7">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex items-center"
          >
            <span className="font-display text-2xl tracking-tight">
              Luxaura
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`,
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm transition ${
                    isActive
                      ? "text-black"
                      : "text-black/50 hover:text-black"
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-black" />
                  )}
                </Link>
              );
            })}

            {/* Favorites */}
            <Show when="signed-in">
              <Link
                href="/account/favorites"
                className={`relative flex items-center gap-1.5 text-sm transition ${
                  pathname.startsWith(
                    "/account/favorites",
                  )
                    ? "text-black"
                    : "text-black/50 hover:text-black"
                }`}
              >
                <Heart
                  size={15}
                  strokeWidth={1.8}
                />

                Favorites

                {pathname.startsWith(
                  "/account/favorites",
                ) && (
                  <span className="absolute -bottom-2 left-0 h-px w-full bg-black" />
                )}
              </Link>
            </Show>
          </div>

          {/* Desktop authentication */}
          <div className="hidden items-center gap-3 md:flex">
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-black/60 transition hover:text-black"
                >
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="redirect">
                <button
                  type="button"
                  className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
                >
                  Create account
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/account"
                className="mr-1 flex items-center gap-2 text-sm text-black/60 transition hover:text-black"
              >
                <UserRound size={16} />

                Account
              </Link>

              <UserButton
                showName
                userProfileMode="navigation"
                userProfileUrl="/account/profile"
                afterSwitchSessionUrl="/account"
              />
            </Show>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen((current) => !current)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 md:hidden"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-black/10 bg-white p-5 shadow-xl md:hidden">
            <div className="flex flex-col">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(
                    `${item.href}/`,
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`border-b border-black/5 py-4 text-sm ${
                      isActive
                        ? "font-medium text-black"
                        : "text-black/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mobile authenticated links */}
              <Show when="signed-in">
                <Link
                  href="/account/favorites"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 border-b border-black/5 py-4 text-sm ${
                    pathname.startsWith(
                      "/account/favorites",
                    )
                      ? "font-medium text-black"
                      : "text-black/60"
                  }`}
                >
                  <Heart size={16} />

                  Favorites
                </Link>

                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-2 border-b border-black/5 py-4 text-sm ${
                    pathname === "/account"
                      ? "font-medium text-black"
                      : "text-black/60"
                  }`}
                >
                  <UserRound size={16} />

                  My Account
                </Link>
              </Show>

              {/* Mobile authentication */}
              <div className="mt-5">
                <Show when="signed-out">
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="redirect">
                      <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="h-12 w-full rounded-full border border-black/10 text-sm font-medium"
                      >
                        Sign in
                      </button>
                    </SignInButton>

                    <SignUpButton mode="redirect">
                      <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="h-12 w-full rounded-full bg-black text-sm font-medium text-white"
                      >
                        Create account
                      </button>
                    </SignUpButton>
                  </div>
                </Show>

                <Show when="signed-in">
                  <div className="flex items-center justify-between rounded-xl bg-[#f7f6f2] p-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-black/40">
                        Account
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        Manage your account
                      </p>
                    </div>

                    <UserButton
                      userProfileMode="navigation"
                      userProfileUrl="/account/profile"
                      afterSwitchSessionUrl="/account"
                    />
                  </div>
                </Show>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

