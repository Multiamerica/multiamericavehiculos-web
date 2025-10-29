// src/components/Gallery.tsx
"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { orderImages } from "@/lib/images";

/** ---------- Componente principal ---------- */
type GalleryProps = { images: string[] };

export default function Gallery({ images = [] }: GalleryProps) {
  const ordered = useMemo(() => orderImages(images), [images]);
  const [current, setCurrent] = useState<string | undefined>(ordered[0]);

  useEffect(() => {
    setCurrent(ordered[0]);
  }, [ordered]);

  return (
    <div>
      <MainImage image={current} />
      <ThumbStrip images={ordered} current={current ?? ""} onSelect={setCurrent} />
    </div>
  );
}

/** ---------- Miniaturas ---------- */
type StripProps = {
  images: string[];
  current: string;
  onSelect: (url: string) => void;
};

export function ThumbStrip({ images, current, onSelect }: StripProps) {
  const ordered = useMemo(() => orderImages(images || []), [images]);
  if (!ordered?.length) return null;

  return (
    <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
      {ordered.map((u, i) => (
        <button
          key={i}
          onClick={() => onSelect(u)}
          className={`border rounded overflow-hidden border-neutral-800 ${
            u === current ? "ring-2 ring-blue-500" : "hover:border-neutral-700"
          }`}
          aria-label={`Miniatura ${i + 1}`}
        >
          <Image
            src={u}
            alt={`Miniatura ${i + 1}`}
            width={200}
            height={120}
            className="w-full h-16 object-cover"
            unoptimized // para Imgur evita compresión automática
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        </button>
      ))}
    </div>
  );
}

/** ---------- Imagen principal ---------- */
type MainProps = { image?: string };

export function MainImage({ image }: MainProps) {
  if (!image) {
    return <div className="aspect-[4/3] bg-neutral-800 rounded-lg" />;
  }

  return (
    <div className="aspect-[4/3] bg-neutral-800 rounded-lg overflow-hidden relative">
      <Image
        src={image}
        alt="Imagen principal del vehículo"
        fill // ocupa todo el contenedor
        className="object-cover"
        unoptimized
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
    </div>
  );
}
