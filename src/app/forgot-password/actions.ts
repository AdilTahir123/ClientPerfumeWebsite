"use server";

import { createHash, randomBytes } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { passwordResets, users } from "@/db/schema";
import { emailConfigured, sendPasswordReset } from "@/lib/email";
import { getT } from "@/lib/lang";
import { siteUrl } from "@/lib/site";

export type ForgotState = { done?: boolean; error?: string };

export async function requestReset(_: ForgotState, f: FormData): Promise<ForgotState> {
  const t = await getT();
  const email = String(f.get("email") ?? "").trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: t("Enter a valid email address.") };
  if (!emailConfigured()) return { error: t("Password reset by email is not set up yet. Please message us on WhatsApp.") };
  const u = (await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1))[0];
  if (u) {
    const now = Math.floor(Date.now() / 1000);
    const recent = await db.select({ id: passwordResets.id }).from(passwordResets).where(and(eq(passwordResets.userId, u.id), gt(passwordResets.expiresAt, now)));
    if (recent.length < 3) {
      const token = randomBytes(32).toString("hex");
      await db.insert(passwordResets).values({ userId: u.id, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: now + 3600 });
      await sendPasswordReset(email, `${siteUrl}/reset-password/${token}`);
    }
  }
  // Same answer whether or not the email has an account, so nobody can use this form to find out who has one
  return { done: true };
}
