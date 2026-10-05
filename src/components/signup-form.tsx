"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signup } from "@/server/auth-actions";
import { Button } from "@/components/button";
import { Field, TextArea, TextInput } from "@/components/field";

const options = [
  ["bed", "waysBed"],
  ["volunteer", "waysVolunteer"],
  ["events", "waysEvents"],
  ["produce", "waysProduce"],
  ["learn", "waysLearn"],
] as const;

export function SignupForm({ initialType, next, language }: { initialType?: string; next?: string; language: "en" | "es" }) {
  const t = useTranslations();
  const [manager, setManager] = useState(initialType === "manager");
  const [state, action, pending] = useActionState(signup, null);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="game-panel bg-[#fffdf8] p-6 sm:p-8">
        <p className="font-game text-4xl text-[#215c45]">Sproutable</p>
        <h1 className="mt-2 font-game text-2xl text-[#3d2914] sm:text-3xl">{t("auth.signupTitle")}</h1>
        <p className="mt-2 text-lg text-muted">{t("auth.quickLead")}</p>
        <form action={action} className="mt-6 space-y-4">
          <input type="hidden" name="account_type" value={manager ? "manager" : "user"} />
          <input type="hidden" name="language" value={language} />
          <input type="hidden" name="next" value={next ?? ""} />
          <Field label={t("auth.name")}>
            <TextInput name="name" required autoComplete="name" />
          </Field>
          <Field label={t("auth.email")}>
            <TextInput name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label={t("auth.password")} hint={t("errors.password")}>
            <TextInput name="password" type="password" required minLength={8} autoComplete="new-password" />
          </Field>
          <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-line px-3">
            <input type="checkbox" checked={manager} onChange={(event) => setManager(event.target.checked)} />
            <span className="font-semibold">{t("auth.managerToggle")}</span>
          </label>
          {manager ? (
            <div className="space-y-4 rounded-3xl border border-line bg-card p-4">
              <p className="text-sm text-muted">{t("auth.managerHint")}</p>
              <Field label={t("auth.gardenName")}>
                <TextInput name="garden_name" required />
              </Field>
              <Field label={t("auth.address")}>
                <TextInput name="address" required />
              </Field>
              <Field label={t("auth.neighborhood")}>
                <TextInput name="neighborhood" required />
              </Field>
              <Field label={t("auth.description")}>
                <TextArea name="description_en" required rows={3} />
              </Field>
              <Field label={t("auth.contactEmail")}>
                <TextInput name="contact_email" type="email" required />
              </Field>
              <fieldset>
                <legend className="font-semibold">{t("auth.involved")}</legend>
                {options.map(([key, label]) => (
                  <label key={key} className="mt-2 flex gap-2">
                    <input type="checkbox" name={`inv_${key}`} defaultChecked={key === "volunteer" || key === "events"} />
                    {t(`garden.${label}`)}
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}
          {state?.error ? <p className="text-[#8d2f2f]">{t(`errors.${state.error}`)}</p> : null}
          <Button type="submit" disabled={pending}>
            {t("auth.submitQuick")}
          </Button>
        </form>
        <p className="mt-4">
          {t("auth.haveAccount")} <Link href="/login" className="font-semibold text-primary">{t("nav.login")}</Link>
        </p>
      </div>
    </div>
  );
}
