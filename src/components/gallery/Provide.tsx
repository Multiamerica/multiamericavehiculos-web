"use client";
import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** 🧩 Ordena las imágenes, priorizando la principal */
function orderImages(urls: string[]) {
  if (!urls || urls.length <= 1) return urls || [];
  const base = (u: string) =>
    (u.split("?")[0].split(/[\/\\]/).pop() || "").toLowerCase();
  const out = [...urls];
  const idx = out.findIndex((u) => base(u).startsWith("principal"));
  if (idx > 0) {
    const [main] = out.splice(idx, 1);
    out.unshift(main);
  }
  return out;
}

/** 🎯 Contexto */
type Ctx = {
  images: string[];
  current: string | undefined;
  setCurrent: (u: string) => void;
  next: () => void;
  prev: () => void;
};

const GalleryCtx = createContext<Ctx | null>(null);

/** 🧠 Proveedor de galería */
export function VehicleGalleryProvider({
  images,
  children,
}: {
  images: string[];
  children: ReactNode;
}) {
  const ordered = useMemo(() => orderImages(images || []), [images]);
  const [current, setCurrent] = useState<string | undefined>(ordered[0]);

  const currentIndex = ordered.indexOf(current || "");
  const next = () =>
    setCurrent(ordered[(currentIndex + 1) % ordered.length]);
  const prev = () =>
    setCurrent(ordered[(currentIndex - 1 + ordered.length) % ordered.length]);

  const value = useMemo(
    () => ({ images: ordered, current, setCurrent, next, prev }),
    [ordered, current]
  );

  return <GalleryCtx.Provider value={value}>{children}</GalleryCtx.Provider>;
}

function useGallery() {
  const ctx = useContext(GalleryCtx);
  if (!ctx)
    throw new Error("useGallery debe usarse dentro de <VehicleGalleryProvider>");
  return ctx;
}

/** 📸 Imagen principal */
export function MainImage() {
  const { current, next, prev } = useGallery();

  if (!current)
    return (
      <div className="aspect-[4/3] bg-neutral-800 rounded-lg" />
    );

  return (
    <div className="relative aspect-[4/3] bg-black/70 rounded-xl overflow-hidden border border-orange-800">
      <img
        src={current}
        alt="Imagen principal"
        className="w-full h-full object-cover transition-all duration-300"
      />

      {/* Flecha izquierda */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-700 text-white p-2 rounded-full transition"
        aria-label="Imagen anterior"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-700 text-white p-2 rounded-full transition"
        aria-label="Siguiente imagen"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

/** 🎞️ Tira de miniaturas */
export function ThumbStrip() {
  const { images, current, setCurrent } = useGallery();
  if (!images?.length) return null;

  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mt-3">
      {images.map((u, i) => (
        <button
          key={i}
          onClick={() => setCurrent(u)}
          className={`border rounded overflow-hidden transition-all duration-200 ${
            u === current
              ? "ring-2 ring-orange-500 border-orange-600"
              : "border-orange-900 hover:border-orange-700"
          }`}
        >
          <img
            src={u}
            alt={`Miniatura ${i + 1}`}
            className="w-full h-14 object-cover"
          />
        </button>
      ))}
    </div>
  );
}
