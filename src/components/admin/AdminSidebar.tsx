"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

import {
  SignOutButton,
  useUser,
} from "@clerk/nextjs";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Properties",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: ClipboardList,
  },
  {
    name: "Agents",
    href: "/admin/agents",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-black/10 px-7 py-7">
          <Link
            href="/"
            className="font-display text-2xl"
          >
            Luxora
          </Link>

          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-black/40">
            Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-black hover:text-white"
                }`}
              >
                <Icon size={18} />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-black/10 p-5">
          <div className="mb-4 flex items-center gap-3">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Admin"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm text-white">
                A
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.fullName ??
                  "Administrator"}
              </p>

              <p className="truncate text-xs text-black/40">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <SignOutButton>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-black/60 transition hover:bg-red-50 hover:text-red-600">
              <LogOut size={17} />
              Sign out
            </button>
          </SignOutButton>

          <Link
            href="/"
            className="mt-2 block px-3 py-3 text-sm text-black/50 transition hover:text-black"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </aside>
  );
}