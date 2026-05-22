"use server";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";

export async function loginAction(
  formData: FormData
): Promise<{ error?: string }> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUsername = process.env.AUTH_USERNAME ?? "admin";
  const validPassword = process.env.AUTH_PASSWORD ?? "changeme";

  if (username !== validUsername || password !== validPassword) {
    return { error: "Invalid username or password" };
  }

  await createSession();
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
