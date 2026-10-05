import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";

const steps = [
  ["map", "/map"],
  ["volunteer", "/volunteer"],
  ["community", "/community"],
  ["growth", "/achievements"],
] as const;

export default async function StartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signup?next=/start");
  const t = await getTranslations("start");

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <p className="font-game text-4xl text-[#215c45]">Sproutable</p>
      <h1 className="mt-2 font-game text-4xl text-[#3d2914] sm:text-5xl">{t("title", { name: user.name.split(" ")[0] })}</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">{t("body")}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map(([key, href]) => (
          <li key={key}>
            <Link href={href} className="game-panel flex h-full flex-col bg-[#fffdf8] p-5">
              <h2 className="font-game text-3xl text-[#3d2914]">{t(`${key}Title`)}</h2>
              <p className="mt-2 flex-1 text-muted">{t(`${key}Body`)}</p>
              <span className="game-btn mt-4 inline-flex min-h-11 items-center self-start bg-[#215c45] px-4 font-semibold text-[#f7f3ea]">{t(`${key}Action`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
