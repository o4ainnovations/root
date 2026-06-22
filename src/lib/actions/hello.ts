"use server";

export async function validateKey(key: string, ref: string) {
  const validKey = process.env.HELLO_SECRET_KEY;
  if (!validKey) {
    return { success: false, error: "Permission system not configured." };
  }
  if (key === validKey) {
    return { success: true, redirect: ref || "/" };
  }
  return { success: false, error: "Invalid secret key." };
}
