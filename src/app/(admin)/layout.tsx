import { auth } from "@/lib/auth";
import { sanityClient } from "@/lib/sanity";
import { AdminNavbar } from "./navbar";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const login = (session.user as { login?: string }).login;
  if (!login) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full card-depth-2 p-10 text-center">
          <h1 className="font-heading text-2xl font-bold text-ink mb-4">Access Denied</h1>
          <hr className="border-hairline my-4" />
          <p className="font-serif text-muted-foreground leading-relaxed">
            Your GitHub account does not have a username configured. Please set a username in your GitHub profile.
          </p>
          <Link href="/api/auth/signout" className="nav-link mt-6 inline-block">Sign Out</Link>
        </div>
      </div>
    );
  }

  const user = await sanityClient.fetch<{ role: string } | null>(
    `*[_type == "authorizedUser" && username == $login && active == true][0]{role}`,
    { login },
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full card-depth-2 p-10 text-center">
          <h1 className="font-heading text-2xl font-bold text-ink mb-4">Access Denied</h1>
          <hr className="border-hairline my-4" />
          <p className="font-serif text-muted-foreground leading-relaxed mb-4">
            Your GitHub account (<strong className="text-ink">{login}</strong>) is not authorized to access the O4A admin panel.
          </p>
          <p className="font-serif text-sm text-muted-foreground leading-relaxed">
            An admin needs to add your GitHub username to the Authorized Users list in Sanity Studio.
          </p>
          <Link href="/api/auth/signout" className="nav-link mt-6 inline-block">Sign Out</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <AdminNavbar userRole={user.role as "admin" | "editor"} />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
