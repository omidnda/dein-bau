import { cookies } from "next/headers";
import { adminCookieName, verifyAdminSession } from "@/lib/admin-auth";

export async function isAdminRequest() { const token = (await cookies()).get(adminCookieName)?.value; return verifyAdminSession(token); }
