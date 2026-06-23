"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import {
  GLOBE_EARLY_ACCESS_REQUESTS,
  GLOBE_USER_MARKERS,
} from "@/shared/lib/globe-markers";
import type { GlobeMarker } from "@/shared/ui/aceternity/globe-3d";
import { SectionTitle } from "@/shared/ui";

const Globe3D = dynamic(
  () => import("@/shared/ui/aceternity/globe-3d").then((module) => module.Globe3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center text-zinc-500 md:h-[560px]">
        Loading globe...
      </div>
    ),
  },
);

export function LandingCommunityGlobe() {
  const markers = useMemo<GlobeMarker[]>(
    () =>
      GLOBE_USER_MARKERS.map((marker) => ({
        lat: marker.lat,
        lng: marker.lng,
        label: marker.label,
      })),
    [],
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <SectionTitle className="text-4xl md:text-5xl">Join the waitlist</SectionTitle>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 md:text-lg">
          {GLOBE_EARLY_ACCESS_REQUESTS} CEOs already applied worldwide.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-4xl">
        <Globe3D
          markers={markers}
          className="h-[480px] md:h-[540px]"
          config={{
            autoRotateSpeed: 0.4,
            showAtmosphere: true,
            atmosphereColor: "#a855f7",
            atmosphereIntensity: 0.3,
            markerSize: 0.034,
          }}
        />
      </div>
    </section>
  );
}
