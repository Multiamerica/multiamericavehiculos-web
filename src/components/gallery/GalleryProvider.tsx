"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

/* Ordena poniendo "principal..." primero */
function orderImages(urls: string[] = []) {
  if (!Array.isArray(urls) || urls.length <= 1) return urls || [];
  const base = (u: string) => (u.split("?")[0].split(/[\/\\]/).pop() || "").toLowerCase();
  const idx = urls.findIndex((u) => base(u).startsWith("principal"));
  if (idx > 0) {
    const out = urls.slice();
    const [main] = out.splice(idx, 1);
    out.unshift(main);
    return out;
  }
  return urls;
}

type Ctx = {
  images: string[];
  index: number;
  current?: string;
  setIndex: (i: number) => void;
  setCurrent: (u: string) => void;
  next: () => void;
  prev: () => void;
};

const GalleryCtx = createContext<Ctx | null>(null);

export function useVehicleGallery() {
  const ctx = useContext(GalleryCtx);
  if (!ctx) throw new Error("useVehicleGallery must be used inside VehicleGalleryProvider");
  return ctx;
}

export function VehicleGalleryProvider({
  images = [],
  children,
}: {
  images: string[];
  children: React.ReactNode;
}) {
  const ordered = useMemo(() => orderImages(images), [images]);
  const [index, setIndex] = useState(0);
  const current = ordered[index];

  const setCurrent = (u: string) => {
    const i = ordered.indexOf(u);
    if (i >= 0) setIndex(i);
  };

  const next = () => setIndex((i) => (ordered.length ? (i + 1) % ordered.length : 0));
  const prev = () => setIndex((i) => (ordered.length ? (i - 1 + ordered.length) % ordered.length : 0));

  const value = useMemo(
    () => ({ images: ordered, index, current, setIndex, setCurrent, next, prev }),
    [ordered, index, current]
  );

  return <GalleryCtx.Provider value={value}>{children}</GalleryCtx.Provider>;
}

/* --------- UI --------- */

export function MainImage() {
  const { current, next, prev } = useVehicleGallery();

  return (
    <div className="relative aspect-[4/3] bg-neutral-800 rounded-lg overflow-hidden">
      {current ? (
        <img
          src={current}
          alt="Imagen principal"
          className="w-full h-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
        />
      ) : null}

      {/* Flecha izquierda */}
      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white px-3 py-2"
      >
        ‹
      </button>

      {/* Flecha derecha */}
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white px-3 py-2"
      >
        ›
      </button>
    </div>
  );
}

export function ThumbStrip() {
  const { images, current, setCurrent } = useVehicleGallery();
  if (!images?.length) return null;

  return (
    <div className="mt-3 grid grid-cols-5 gap-2 md:grid-cols-8">
      {images.map((u, i) => (
        <button
          key={i}
          onClick={() => setCurrent(u)}
          className={`border rounded overflow-hidden border-neutral-800 ${
            u === current ? "ring-2 ring-blue-500" : "hover:border-neutral-700"
          }`}
          aria-label={`Miniatura ${i + 1}`}
        >
          <img
            src={u}
            alt={`Miniatura ${i + 1}`}
            className="w-full h-20 object-cover"  // ← miniaturas un poco más altas
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
          />
        </button>
      ))}
    </div>
  );
}
