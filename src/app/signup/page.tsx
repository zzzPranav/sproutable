import { getLocale } from "next-intl/server";
import { SignupForm } from "@/components/signup-form";
import type { Language } from "@/lib/types";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ type?: string; next?: string }> }) {
  const { type, next } = await searchParams;
  const locale = (await getLocale()) as Language;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "";
  return <SignupForm initialType={type} next={safeNext} language={locale} />;
}
