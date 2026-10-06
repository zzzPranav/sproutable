"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();
  console.error(error);
  return (
    <section className="mx-auto max-w-xl px-4 py-20">
      <h1 className="text-3xl font-semibold">{t("common.dataError")}</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="min-h-11 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground" onClick={reset} type="button">
          {t("common.retry")}
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-semibold">
          {t("common.home")}
        </Link>
        <Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-primary">
          {t("nav.login")}
        </Link>
      </div>
    </section>
  );
}
