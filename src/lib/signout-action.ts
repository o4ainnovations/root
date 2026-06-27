"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signOutAction() {
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const csrfRes = await fetch(`${base}/api/auth/csrf`, {
    headers: { cookie: hdrs.get("cookie") ?? "" },
  });
  const { csrfToken } = await csrfRes.json();

  await fetch(`${base}/api/auth/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: hdrs.get("cookie") ?? "",
    },
    body: new URLSearchParams({ csrfToken }),
  });

  redirect("/");
}
