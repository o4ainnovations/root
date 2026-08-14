import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { sanityClient } from "@/lib/sanity";
import SettingsPageClient from "./client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");
  const login = (session.user as { login?: string }).login;
  if (!login) redirect("/");

  const user = await sanityClient.fetch<{ role: string } | null>(
    `*[_type == "authorizedUser" && username == $login && active == true][0]{role}`,
    { login },
  );
  if (!user || user.role !== "admin") redirect("/admin");

  return <SettingsPageClient />;
}
