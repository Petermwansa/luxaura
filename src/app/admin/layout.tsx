import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin =
    sessionClaims?.metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <AdminSidebar />

      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}