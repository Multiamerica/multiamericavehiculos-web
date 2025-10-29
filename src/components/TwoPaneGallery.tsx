// src/components/TwoPaneGallery.tsx
"use client";
import { useMemo, useState, useEffect } from "react";
import { normalizeAll, orderImages } from "@/lib/images";

/** 📸 Imagen principal con navegación (flechas + click lateral) */
function MainImage({
  image,
  hasMany,
  onPrev,
  onNext,
}: {
  image?: string;
  hasMany: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!image)
    return (
      <div className="aspect-[4/3] bg-black/50 rounded-xl border border-orange-900 overflow-hidden" />
    );

  return (
    <div
      className="relative bg-black/60 rounded-xl overflow-hidden border border-orange-800 select-none w-full h-full"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") onPrev();
        if (e.key === "ArrowRight") onNext();
      }}
      aria-label="Galería de imágenes del vehículo"
    >
      <img
        src={image}
        alt="Imagen principal del vehículo"
        className="w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />

      {/* Flechas visibles */}
      {hasMany && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center 
                       rounded-full bg-black/60 text-white hover:bg-orange-600 transition-colors z-20"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center 
                       rounded-full bg-black/60 text-white hover:bg-orange-600 transition-colors z-20"
          >
            ›
          </button>

          {/* 🔸 Zonas clicables invisibles en los laterales */}
          <button
            type="button"
            aria-label="Anterior"
            onClick={onPrev}
            className="absolute left-0 top-0 h-full w-1/2 opacity-0 cursor-pointer z-10"
          />
          <button
            type="button"
            aria-label="Siguiente"
            onClick={onNext}
            className="absolute right-0 top-0 h-full w-1/2 opacity-0 cursor-pointer z-10"
          />
        </>
      )}
    </div>
  );
}

/** 🎞️ Tira de miniaturas (compacta) */
function ThumbStrip({
  images,
  currentIndex,
  onSelect,
}: {
  images: string[];
  currentIndex: number;
  onSelect: (idx: number) => void;
}) {
  if (!images?.length) return null;

  return (
    <div className="mt-3 flex flex-wrap justify-start gap-2 max-h-60 overflow-y-auto">
      {images.map((u, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`border rounded overflow-hidden transition-all duration-200
            ${
              i === currentIndex
                ? "ring-2 ring-orange-500 border-orange-600"
                : "border-orange-900 hover:border-orange-700"
            }`}
          aria-label={`Miniatura ${i + 1}`}
          style={{ width: "100px", height: "80px", flexShrink: 0 }}
        >
          <img
            src={u}
            alt={`Miniatura ${i + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        </button>
      ))}
    </div>
  );
}

/** 🧩 Galería completa: imagen principal + miniaturas */
export default function TwoPaneGallery({ images }: { images: string[] }) {
  const prepared = useMemo(
    () => orderImages(normalizeAll(images || [])),
    [images]
  );

  const [i, setI] = useState(0);

  // Resetear índice si cambia la cantidad de imágenes
  useEffect(() => setI(0), [prepared.length]);

  if (!prepared?.length) return null;

  const prev = () => setI((n) => (n - 1 + prepared.length) % prepared.length);
  const next = () => setI((n) => (n + 1) % prepared.length);

  return (
    <div>
      {/* Imagen principal */}
      <MainImage
        image={prepared[i]}
        hasMany={prepared.length > 1}
        onPrev={prev}
        onNext={next}
      />

      {/* Miniaturas (si hay más de una) */}
      {prepared.length > 1 && (
        <ThumbStrip images={prepared} currentIndex={i} onSelect={setI} />
      )}
    </div>
  );
}
