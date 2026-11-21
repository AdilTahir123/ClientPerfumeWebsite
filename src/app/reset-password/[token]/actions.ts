"use server";

import { createHash } from "crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { loginAttempts, passwordResets, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { getT } from "@/lib/lang";

export type ResetState = { error?: string };

export async function resetPassword(token: string, _: ResetState, f: FormData): Promise<ResetState> {
  const t = await getT();
  const password = String(f.get("password") ?? "");
  if (password.length < 8) return { error: t("Password must be at least 8 characters.") };
  const now = Math.floor(Date.now() / 1000);
  const hash = createHash("sha256").update(token).digest("hex");
  const row = (await db.select().from(passwordResets).where(and(eq(passwordResets.tokenHash, hash), gt(passwordResets.expiresAt, now), isNull(passwordResets.usedAt))).limit(1))[0];
  if (!row) return { error: t("This link is not valid any more. Ask for a new one.") };
  // Mark it used first, only if nobody else used it in the meantime, so the link works exactly once
  const used = await db.update(passwordResets).set({ usedAt: now }).where(and(eq(passwordResets.id, row.id), isNull(passwordResets.usedAt)));
  if (used.rowsAffected === 0) return { error: t("This link is not valid any more. Ask for a new one.") };
  const u = (await db.select({ email: users.email }).from(users).where(eq(users.id, row.userId)).limit(1))[0];
  await db.update(users).set({ passwordHash: hashPassword(password) }).where(eq(users.id, row.userId));
  if (u) await db.delete(loginAttempts).where(eq(loginAttempts.email, u.email));
  redirect("/login?reset=1");
}
