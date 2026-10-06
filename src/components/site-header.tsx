import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { logout } from "@/server/auth-actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLink } from "@/components/nav-link";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/data/store";
import { unreadCount } from "@/lib/inbox";
import type { Language } from "@/lib/types";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const journal = await getTranslations("journalHub");
  const locale = (await getLocale()) as Language;
  const user = await getCurrentUser();
  const db = user ? await readDb() : null;
  const unread = user && db ? unreadCount(db, user) : 0;

  const linkClass = "inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full px-2 text-center text-sm font-semibold hover:bg-[#f3efe4] aria-[current=page]:bg-[#f3efe4] lg:w-auto lg:px-3 lg:text-base lg:aria-[current=page]:bg-white";

  const tabs = (
    <nav className="grid grid-cols-4 gap-1 rounded-2xl bg-[#fffdf8] p-1 lg:flex lg:flex-1 lg:justify-center lg:bg-transparent lg:p-0" aria-label={t("primary")}>
      <NavLink href="/community" className={linkClass}>{t("community")}</NavLink>
      <NavLink href="/growing" className={linkClass}>{t("growing")}</NavLink>
      <NavLink href="/map" className={linkClass}>{t("map")}</NavLink>
      <NavLink href="/achievements" className={linkClass}>{t("achievements")}</NavLink>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 border-b-4 border-[#3d2914] bg-[#f7f3ea]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-game text-xl leading-none text-primary sm:text-2xl">
            Sproutable
          </Link>
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Link href="/journal" className="game-btn inline-flex min-h-11 shrink-0 items-center bg-[#e3b23c] px-3 font-game text-sm text-[#3d2914]">
              {journal("add")}
            </Link>
          <LanguageSwitcher locale={locale} label={t("language")} />
          {user ? (
            <>
              <Link href="/inbox" className="relative inline-flex min-h-11 items-center rounded-full px-2 text-sm font-semibold hover:bg-white sm:px-3 sm:text-base" aria-label={t("inbox")}>
                {t("inbox")}
                {unread > 0 ? (
                  <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-accent px-1.5 text-sm text-accent-foreground">
                    {unread}
                  </span>
                ) : null}
              </Link>
              <details className="relative">
                <summary aria-label={t("menu")} className="max-w-[6.5rem] cursor-pointer list-none truncate rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold sm:max-w-none sm:text-base">
                  {user.name.split(" ")[0]}
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-line bg-card p-2 shadow-lg">
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/welcome">
                    {t("welcomeTour")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/gardens">
                    {t("gardens")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/buddies">
                    {t("buddies")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/feedback">
                    {t("feedback")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/gardener">
                    {t("gardener")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/journal">
                    {t("journal")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/dashboard">
                    {t("dashboard")}
                  </Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/settings/profile">
                    {t("profile")}
                  </Link>
                  <form action={logout}>
                    <button className="w-full rounded-xl px-3 py-2 text-left hover:bg-background" type="submit">
                      {t("logout")}
                    </button>
                  </form>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2 text-sm font-semibold sm:px-3 sm:text-base">
                {t("login")}
              </Link>
              <Link href="/signup" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-accent px-3 text-sm font-semibold text-accent-foreground sm:px-4 sm:text-base">
                {t("signup")}
              </Link>
            </>
          )}
          </div>
        </div>
        {tabs}
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/journal" className="game-btn inline-flex min-h-11 shrink-0 items-center bg-[#e3b23c] px-3 font-game text-sm text-[#3d2914] sm:text-lg">
            {journal("add")}
          </Link>
          <LanguageSwitcher locale={locale} label={t("language")} />
          {user ? (
            <>
              <Link href="/inbox" className="relative inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold hover:bg-white" aria-label={t("inbox")}>
                {t("inbox")}
                {unread > 0 ? (
                  <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-accent px-1.5 text-sm text-accent-foreground">{unread}</span>
                ) : null}
              </Link>
              <details className="relative">
                <summary aria-label={t("menu")} className="cursor-pointer list-none rounded-full border border-line bg-card px-3 py-2 text-sm font-semibold">
                  {user.name.split(" ")[0]}
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-line bg-card p-2 shadow-lg">
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/welcome">{t("welcomeTour")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/gardens">{t("gardens")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/buddies">{t("buddies")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/feedback">{t("feedback")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/gardener">{t("gardener")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/journal">{t("journal")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/dashboard">{t("dashboard")}</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-background" href="/settings/profile">{t("profile")}</Link>
                  <form action={logout}>
                    <button className="w-full rounded-xl px-3 py-2 text-left hover:bg-background" type="submit">{t("logout")}</button>
                  </form>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold">{t("login")}</Link>
              <Link href="/signup" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground">{t("signup")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
