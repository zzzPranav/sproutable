"use client";

import { useState } from "react";
import Link from "next/link";
import { ARRIVAL_MILES, milesBetween, type NearbyGarden } from "@/lib/nearby-gardens";
import { reportPlaceVisit } from "@/server/place-actions";

export function GardenVisitCard({
  garden,
  live,
  signedIn,
  copy,
  onClose,
  surveyOpen,
  onSurveyClose,
}: {
  garden: NearbyGarden;
  live: { lat: number; lng: number } | null;
  signedIn: boolean;
  copy: {
    listedOnly: string;
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
  };
  onClose: () => void;
  surveyOpen: boolean;
  onSurveyClose: () => void;
}) {
  const miles = live ? milesBetween(live.lat, live.lng, garden.lat, garden.lng) : null;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${garden.lat},${garden.lng}&travelmode=walking`;

  return (
    <>
      <article className="rounded-2xl border-4 border-[#3d2914] bg-[#fffdf8] p-3 shadow-[4px_4px_0_#3d2914] sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#8a5a32]">{copy.listedOnly}</p>
            <h3 className="font-game text-xl leading-tight text-[#3d2914] sm:text-2xl">{garden.name}</h3>
          </div>
          <button type="button" onClick={onClose} className="min-h-11 shrink-0 px-2 font-semibold text-primary">
            {copy.close}
          </button>
        </div>
        <p className="mt-1 text-sm">{garden.address}</p>
        <p className="text-sm text-muted">{garden.neighborhood}</p>
        {miles !== null ? (
          <p className="mt-2 font-semibold text-primary">{miles <= ARRIVAL_MILES ? copy.here : copy.away.replace("{miles}", miles.toFixed(2))}</p>
        ) : (
          <p className="mt-2 text-sm text-muted">{copy.needLocation}</p>
        )}
        <a href={directions} target="_blank" rel="noopener noreferrer" className="game-btn mt-3 inline-flex min-h-11 w-full items-center justify-center bg-[#215c45] px-4 font-semibold text-[#f7f3ea] sm:w-auto">
          {copy.directions}
        </a>
        <p className="mt-2 text-sm">{copy.walkHint}</p>
      </article>
      {surveyOpen ? (
        <ArrivalSurvey gardenId={garden.id} gardenName={garden.name} signedIn={signedIn} copy={copy} onClose={onSurveyClose} />
      ) : null}
    </>
  );
}

function ArrivalSurvey({
  gardenId,
  gardenName,
  signedIn,
  copy,
  onClose,
}: {
  gardenId: string;
  gardenName: string;
  signedIn: boolean;
  copy: {
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
  };
  onClose: () => void;
}) {
  const [opened, setOpened] = useState<"" | "yes" | "no">("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const returnTo = "/login?next=/map";
  const signUpTo = "/signup?next=/map";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!opened) {
      setError(copy.choose);
      return;
    }
    setPending(true);
    setError("");
    const result = await reportPlaceVisit(gardenId, opened === "yes", note);
    setPending(false);
    if (result.ok) setSaved(true);
    else setError(result.error === "auth" ? copy.loginToSave : copy.choose);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto overscroll-contain bg-[#1c1917]/40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-4" role="presentation">
      <form role="dialog" aria-modal="true" aria-labelledby="arrival-title" onSubmit={onSubmit} className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl border-4 border-[#3d2914] bg-[#fffdf8] p-4 shadow-[6px_6px_0_#3d2914] sm:p-5">
        <h3 id="arrival-title" className="font-game text-3xl text-[#3d2914]">{copy.arrivedTitle}</h3>
        <p className="mt-1 font-semibold">{gardenName}</p>
        {saved ? (
          <>
            <p className="mt-4 rounded-2xl bg-[#e7f4ea] px-4 py-3">{copy.saved}</p>
            <button type="button" onClick={onClose} className="game-btn mt-4 min-h-11 bg-[#215c45] px-4 font-semibold text-[#f7f3ea]">
              {copy.close}
            </button>
          </>
        ) : (
          <>
            <fieldset className="mt-4">
              <legend className="font-semibold">{copy.opened}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(["yes", "no"] as const).map((value) => (
                  <label key={value} className={`flex min-h-11 items-center gap-2 rounded-2xl border px-3 ${opened === value ? "border-[#215c45] bg-[#e7f4ea]" : "border-line"}`}>
                    <input type="radio" name="opened" value={value} checked={opened === value} onChange={() => setOpened(value)} />
                    {value === "yes" ? copy.yes : copy.no}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="mt-4 block font-semibold" htmlFor="place-note">
              {copy.report}
            </label>
            <textarea
              id="place-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={400}
              rows={3}
              placeholder={copy.reportHint}
              className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"
            />
            {error ? <p className="mt-2 text-[#8d2f2f]">{error}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {signedIn ? (
                <button type="submit" disabled={pending} className="game-btn min-h-11 bg-[#215c45] px-4 font-semibold text-[#f7f3ea] disabled:opacity-50">
                  {copy.save}
                </button>
              ) : (
                <>
                  <Link href={signUpTo} className="game-btn inline-flex min-h-11 items-center bg-[#215c45] px-4 font-semibold text-[#f7f3ea]">
                    {copy.signupToSave}
                  </Link>
                  <Link href={returnTo} className="inline-flex min-h-11 items-center px-3 font-semibold text-primary">
                    {copy.loginToSave}
                  </Link>
                </>
              )}
              <button type="button" onClick={onClose} className="min-h-11 px-3 font-semibold">
                {copy.close}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
