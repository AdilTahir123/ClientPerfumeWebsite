"use client";

import { useActionState } from "react";
import { useT } from "@/lib/lang-client";
import { resetPassword } from "./actions";

export default function ResetForm({ token }: { token: string }) {
  const t = useT();
  const [state, run, pending] = useActionState(resetPassword.bind(null, token), {});
  return (
    <section className="mx-auto flex max-w-[460px] flex-col gap-6 px-5 py-10 md:py-16">
      <h1 className="font-display text-[40px] font-medium leading-[1.05] md:text-[48px]">{t("Choose a new password")}</h1>
      <form action={run} className="flex flex-col gap-4">
        <div><label htmlFor="password" className="mb-1 block text-xs uppercase tracking-[0.18em] text-muted">{t("New password")}</label><input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="min-h-11 w-full rounded border border-line2 bg-surface px-3 text-base text-ink" /></div>
        {state.error && <p role="alert" className="m-0 rounded border border-red-400/60 bg-red-400/10 p-3 text-red-300">{state.error}</p>}
        <button type="submit" disabled={pending} className="bg-gold flex min-h-[52px] cursor-pointer items-center justify-center rounded-sm text-sm font-semibold uppercase tracking-[0.08em] text-onacc disabled:opacity-60">{pending ? t("Please wait…") : t("Save new password")}</button>
      </form>
    </section>
  );
}
