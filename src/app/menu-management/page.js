import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import MenuManagement from "./MenuManagement";

export const metadata = {
  title: "Menu Management | Addis Eats",
  description: "Manage Addis Eats menu items.",
};

export const dynamic = "force-dynamic";

export default async function MenuManagementPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/signin?next=/menu-management");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return <MenuManagement />;
}