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

  const linkClass = "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-1.5 text-sm font-semibold hover:bg-white aria-[current=page]:bg-white sm:px-3 sm:text-base";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[#f7f1e4]/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="mr-auto font-game text-xl leading-none text-primary sm:text-2xl">
            Sproutable
          </Link>
          <Link href="/journal" className="game-btn inline-flex min-h-11 shrink-0 items-center bg-[#e3b23c] px-3 font-game text-sm text-[#3d2914] sm:text-lg">
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
        <nav className="mt-1 flex gap-0.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:mt-2 sm:gap-1 [&::-webkit-scrollbar]:hidden" aria-label={t("primary")}>
          <NavLink href="/community" className={linkClass}>
            {t("community")}
          </NavLink>
          <NavLink href="/growing" className={linkClass}>
            {t("growing")}
          </NavLink>
          <NavLink href="/map" className={linkClass}>
            {t("map")}
          </NavLink>
          <NavLink href="/achievements" className={linkClass}>
            {t("achievements")}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
