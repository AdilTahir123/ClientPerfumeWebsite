// Forgot the admin password? Run:  npm run admin:reset
// It sets the password of the admin account named in ADMIN_EMAIL to NEW_ADMIN_PASSWORD (or creates it).
// On the live site run it with DATABASE_URL and DATABASE_AUTH_TOKEN set to your Turso values.
try { process.loadEnvFile(".env"); } catch {}
import { eq } from "drizzle-orm";
import { db } from "./index";
import { loginAttempts, users } from "./schema";
import { hashPassword } from "../lib/password";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.NEW_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('Set ADMIN_EMAIL and NEW_ADMIN_PASSWORD first. Example (PowerShell):\n  $env:ADMIN_EMAIL="you@gmail.com"; $env:NEW_ADMIN_PASSWORD="a-strong-password"; npm run admin:reset');
    process.exit(1);
  }
  if (password.length < 10) {
    console.log("Use a password with at least 10 characters.");
    process.exit(1);
  }
  const hash = hashPassword(password);
  const has = (await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1))[0];
  if (has) await db.update(users).set({ passwordHash: hash, role: "admin" }).where(eq(users.id, has.id));
  else await db.insert(users).values({ name: "Admin", email, passwordHash: hash, role: "admin" });
  await db.delete(loginAttempts).where(eq(loginAttempts.email, email));
  console.log(has ? `Password changed for admin ${email}. You can log in now.` : `Created admin ${email}. You can log in now.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
