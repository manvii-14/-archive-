import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Verifies the caller is signed in AND has the admin role.
 * Returns { session } on success, or { error: Response } to return immediately on failure.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      error: new Response(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      error: new Response(
        JSON.stringify({ message: "Forbidden: admin access required" }),
        { status: 403 }
      ),
    };
  }

  return { session };
}