"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useT } from "@/lib/lang-client";
import { requestReset } from "./actions";

const field = "min-h-11 w-full rounded border border-line2 bg-surface px-3 text-base text-ink";

export default function ForgotForm() {
  const t = useT();
  const [state, run, pending] = useActionState(requestReset, {});
  return (
    <section className="mx-auto flex max-w-[460px] flex-col gap-6 px-5 py-10 md:py-16">
      <h1 className="font-display text-[40px] font-medium leading-[1.05] md:text-[48px]">{t("Forgot password")}</h1>
      {state.done ? (
        <p role="status" className="m-0 rounded border border-accent p-4 text-accent">{t("If that email has an account, we have sent a link to reset the password. It works for 1 hour.")}</p>
      ) : (
        <form action={run} className="flex flex-col gap-4">
          <p className="m-0 text-muted">{t("Enter your email and we will send you a link to choose a new password.")}</p>
          <div><label htmlFor="email" className="mb-1 block text-xs uppercase tracking-[0.18em] text-muted">{t("Email")}</label><input id="email" name="email" type="email" required autoComplete="email" className={field} /></div>
          {state.error && <p role="alert" className="m-0 rounded border border-red-400/60 bg-red-400/10 p-3 text-red-300">{state.error}</p>}
          <button type="submit" disabled={pending} className="bg-gold flex min-h-[52px] cursor-pointer items-center justify-center rounded-sm text-sm font-semibold uppercase tracking-[0.08em] text-onacc disabled:opacity-60">{pending ? t("Please wait…") : t("Send reset link")}</button>
        </form>
      )}
      <Link href="/login" className="text-accent underline">{t("Back to log in")}</Link>
    </section>
  );
}
