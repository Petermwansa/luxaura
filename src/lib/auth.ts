import { auth } from "@clerk/nextjs/server";

export async function isAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return false;
  }

  return sessionClaims?.metadata?.role === "admin";
}

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized",
    };
  }

  if (
    sessionClaims?.metadata?.role !== "admin"
  ) {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden",
    };
  }

  return {
    authorized: true,
    userId,
  };
}