import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required.");
  }
  const login = (session.user as { login?: string }).login;
  if (!login) {
    throw new Error("Unauthorized: No GitHub username found.");
  }
  return login;
}
