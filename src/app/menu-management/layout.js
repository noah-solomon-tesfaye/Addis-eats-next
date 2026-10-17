import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../AdminSidebar";

export default async function MenuManagementLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?next=/menu-management");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="h-screen overflow-hidden bg-[#faf8f3] lg:flex">
      <AdminSidebar />

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}