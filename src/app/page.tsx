import { getTranslations } from "next-intl/server";
import { Village } from "@/components/game/village";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const t = await getTranslations("village");
  const user = await getCurrentUser();
  return (
    <Village
      name={user?.name.split(" ")[0] || t("visitor")}
      guest={!user}
      caption={t("caption")}
      moveHint={t("move")}
      enterLabel={t("enter")}
      tourHref="/welcome"
      tourLabel={t("tour")}
      talkLabel={t("talk")}
      closeLabel={t("close")}
      loginHello={t("loginHello")}
      loginHref="/login?next=/"
      neighbors={[
        { id: "ana", name: "Ana", shirt: "#3d6f8f", x: 34, y: 64, line: t("anaLine"), action: t("anaAction"), href: "/community" },
        { id: "luis", name: "Luis", shirt: "#8f3b1c", x: 58, y: 26, line: t("luisLine"), action: t("luisAction"), href: "/growing" },
      ]}
      places={[
        { id: "map", href: "/map", label: t("map"), hint: t("mapHint"), x: 46, y: 18 },
        { id: "community", href: "/community", label: t("community"), hint: t("communityHint"), x: 24, y: 34 },
        { id: "growing", href: "/growing", label: t("growing"), hint: t("growingHint"), x: 74, y: 42 },
        { id: "achievements", href: "/achievements", label: t("achievements"), hint: t("achievementsHint"), x: 70, y: 74 },
      ]}
    />
  );
}
