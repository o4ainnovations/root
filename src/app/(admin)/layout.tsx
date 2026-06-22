import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sanityClient } from "@/lib/sanity";
import { AdminNavbar } from "./navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const login = (session.user as { login?: string }).login;
  if (!login) {
    redirect("/");
  }

  const user = await sanityClient.fetch<{ role: string } | null>(
    `*[_type == "authorizedUser" && username == $login && active == true][0]{role}`,
    { login },
  );

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <AdminNavbar userRole={user.role as "admin" | "editor"} />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
