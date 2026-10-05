"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GardenMap } from "@/components/garden-map";
import { GardenVisitCard } from "@/components/garden-visit-card";
import { ARRIVAL_MILES, HOME_BASE, milesBetween, type NearbyGarden } from "@/lib/nearby-gardens";

type LiveFix = { lat: number; lng: number };

export function MapExplorer({
  token,
  gardens,
  signedIn,
  copy,
}: {
  token: string;
  gardens: (NearbyGarden & { miles: number })[];
  signedIn: boolean;
  copy: {
    youAreHere: string;
    startingPoint: string;
    liveStart: string;
    liveWaiting: string;
    liveOn: string;
    liveCenter: string;
    liveDenied: string;
    liveUnavailable: string;
    liveUnsupported: string;
    fromYou: string;
    nearby: string;
    miles: string;
    openGarden: string;
    openPin: string;
    notOnSproutable: string;
    missingToken: string;
    listLabel: string;
    mapLabel: string;
    favorite: string;
    visited: string;
    onPlatform: string;
    listedOnly: string;
    legendOn: string;
    legendOff: string;
    directions: string;
    walkHint: string;
    away: string;
    here: string;
    needLocation: string;
    arrivedTitle: string;
    opened: string;
    yes: string;
    no: string;
    report: string;
    reportHint: string;
    save: string;
    saved: string;
    loginToSave: string;
    signupToSave: string;
    close: string;
    choose: string;
    listedPin: string;
  };
}) {
  const [selectedId, setSelectedId] = useState("");
  const [live, setLive] = useState<LiveFix | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "live" | "denied" | "unavailable" | "unsupported">("idle");
  const [focusLive, setFocusLive] = useState(0);
  const [surveyFor, setSurveyFor] = useState("");
  const watchId = useRef<number | null>(null);
  const centered = useRef(false);
  const dismissed = useRef(new Set<string>());
  const router = useRouter();
  const selected = gardens.find((garden) => garden.id === selectedId) ?? null;

  useEffect(() => {
    shareLocation();
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
    // Start once. shareLocation no-ops if a watch is already running.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected || selected.slug || !live) return;
    const miles = milesBetween(live.lat, live.lng, selected.lat, selected.lng);
    if (miles > ARRIVAL_MILES * 2) dismissed.current.delete(selected.id);
    if (miles <= ARRIVAL_MILES && !dismissed.current.has(selected.id)) setSurveyFor(selected.id);
  }, [live, selected]);

  function shareLocation() {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    if (watchId.current !== null) {
      setFocusLive((value) => value + 1);
      return;
    }
    setStatus("waiting");
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLive({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("live");
        if (!centered.current) {
          centered.current = true;
          setFocusLive(1);
        }
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr] lg:items-start">
      <div className="order-first flex flex-wrap gap-3 text-sm lg:col-span-2">
        <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-card px-3 py-1 text-sm font-semibold">
          <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center">
            <span className="map-pin map-pin-onboarded" />
          </span>
          {copy.legendOn}
        </span>
        <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-card px-3 py-1 text-sm font-semibold">
          <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center">
            <span className="map-pin map-pin-listed" />
          </span>
          {copy.legendOff}
        </span>
      </div>
      <section className="order-2 rounded-3xl border border-line bg-card p-4 lg:order-1 lg:max-h-[72vh] lg:overflow-auto" aria-label={copy.listLabel}>
        <h2 className="text-lg font-semibold">{copy.youAreHere}</h2>
        {status === "live" ? <p className="mt-1 text-sm text-muted">{copy.liveOn}</p> : null}
        {status === "waiting" ? <p className="mt-1 text-sm text-muted">{copy.liveWaiting}</p> : null}
        {status === "denied" ? <p className="mt-1 text-sm text-[#8d2f2f]">{copy.liveDenied}</p> : null}
        {status === "unavailable" ? <p className="mt-1 text-sm text-[#8d2f2f]">{copy.liveUnavailable}</p> : null}
        {status === "unsupported" ? <p className="mt-1 text-sm text-[#8d2f2f]">{copy.liveUnsupported}</p> : null}
        <button type="button" onClick={shareLocation} className="mt-3 min-h-11 rounded-full bg-primary px-4 font-semibold text-primary-foreground">
          {status === "live" ? copy.liveCenter : copy.liveStart}
        </button>
        <h2 className="mt-5 text-lg font-semibold">{copy.startingPoint}</h2>
        <p className="mt-1 font-semibold">{HOME_BASE.name}</p>
        <p className="text-sm text-muted">{HOME_BASE.address}</p>
        <h2 className="mt-5 text-lg font-semibold">{copy.nearby}</h2>
        <ul className="mt-3 space-y-2">
          {gardens.map((garden) => {
            const selected = garden.id === selectedId;
            const fromYou = live ? milesBetween(live.lat, live.lng, garden.lat, garden.lng) : null;
            return (
              <li key={garden.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    if (garden.slug) router.push(`/gardens/${garden.slug}`);
                    else setSelectedId(garden.id);
                  }}
                  className={`w-full rounded-2xl border px-3 py-3 text-left ${selected ? "border-primary bg-primary/10" : "border-line hover:border-primary"}`}
                >
                  <span className="block font-semibold">
                    {garden.favorite ? `★ ${copy.favorite} · ` : ""}
                    {garden.name}
                    {garden.visited ? ` · ${copy.visited}` : ""}
                  </span>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${garden.slug ? "bg-[#215c45] text-[#f7f3ea]" : "bg-[#c4a574] text-[#3d2914]"}`}>
                    {garden.slug ? copy.onPlatform : copy.listedOnly}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {garden.neighborhood} · {garden.miles.toFixed(1)} {copy.miles}
                    {fromYou !== null ? ` · ${fromYou.toFixed(1)} ${copy.miles} ${copy.fromYou}` : ""}
                  </span>
                  <span className="mt-1 block text-sm">{garden.address}</span>
                </button>
                {garden.slug ? (
                  <Link href={`/gardens/${garden.slug}`} className="mt-1 inline-flex min-h-11 items-center px-3 font-semibold text-primary">
                    {copy.openGarden}
                  </Link>
                ) : (
                  <p className="px-3 pt-1 text-sm text-muted">{copy.notOnSproutable}</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <section className="relative order-1 h-[58vh] min-h-[300px] w-full overflow-hidden rounded-3xl border border-line bg-card lg:order-2 lg:h-[72vh]" aria-label={copy.mapLabel}>
        <GardenMap
          token={token}
          gardens={gardens}
          selectedId={selectedId}
          onSelect={setSelectedId}
          youAreHere={copy.startingPoint}
          live={live}
          liveLabel={copy.youAreHere}
          focusLive={focusLive}
          missingToken={copy.missingToken}
          openPin={copy.openPin}
          listedPin={copy.listedPin}
        />
        {selected && !selected.slug ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 max-h-[70dvh] overflow-auto px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:absolute lg:inset-x-3 lg:bottom-3 lg:z-10 lg:max-h-[75%] lg:px-0 lg:pb-0">
            <div className="pointer-events-auto">
              <GardenVisitCard
                garden={selected}
                live={live}
                signedIn={signedIn}
                copy={copy}
                surveyOpen={surveyFor === selected.id}
                onClose={() => setSelectedId("")}
                onSurveyClose={() => {
                  dismissed.current.add(selected.id);
                  setSurveyFor("");
                }}
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
