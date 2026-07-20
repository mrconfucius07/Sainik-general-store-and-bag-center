import { requireAdmin } from "@/lib/auth";

/** Admin guard used by /api/admin/* routes and the /admin layout. */
export async function isAdminAuthenticated(): Promise<boolean> {
  return (await requireAdmin()) !== null;
}
