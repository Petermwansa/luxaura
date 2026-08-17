import Link from "next/link";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

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

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/10 bg-white lg:block">
        <div className="flex h-full flex-col">
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

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-black/60 transition hover:bg-black hover:text-white"
                >
                  <Icon size={18} />

                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-black/10 p-5">
            <Link
              href="/"
              className="text-sm text-black/50 transition hover:text-black"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}