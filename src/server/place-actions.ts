"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { updateDb } from "@/lib/data/store";
import { NEARBY_GARDENS } from "@/lib/nearby-gardens";

export async function reportPlaceVisit(placeId: string, opened: boolean, note: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" as const };
  const place = NEARBY_GARDENS.find((garden) => garden.id === placeId);
  if (!place || place.slug) return { error: "missing" as const };
  const text = note.trim().slice(0, 400);
  await updateDb((db) => {
    if (!db.placeReports) db.placeReports = [];
    db.placeReports.push({
      report_id: randomUUID(),
      place_id: place.id,
      user_id: user.user_id,
      opened,
      note: text,
      created_at: new Date().toISOString(),
    });
  });
  revalidatePath("/map");
  return { ok: true as const };
}
