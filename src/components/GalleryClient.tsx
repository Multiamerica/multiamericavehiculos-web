"use client";

import { useMemo, useState, useCallback, useEffect } from "react";

/** Mantiene la 1ra "principal" al frente, si existe. */
function normalizeOrder(urls: string[] = []) {
  if (!Array.isArray(urls) || urls.length <= 1) return urls || [];
  const base = (u: string) =>
    (u.split("?")[0].split(/[\/\\]/).pop() || "").toLowerCase();
  const idx = urls.findIndex((u) => base(u).startsWith("principal"));
  if (idx > 0) {
    const out = urls.slice();
    const [m] = out.splice(idx, 1);
    out.unshift(m);
    return out;
  }
  return urls;
}

export default function GalleryClient({ images }: { images: string[] }) {
  const ordered = useMemo(
    () => normalizeOrder((images || []).filter(Boolean)),
    [images]
  );
  const [i, setI] = useState(0);
  const [errores, setErrores] = useState<Set<string>>(new Set());

  // Reinicia el índice si cambia la lista
  useEffect(() => setI(0), [ordered.length]);

  const handleImgError = useCallback(
    (src: string) => setErrores((prev) => new Set([...prev, src])),
    []
  );

  const prev = useCallback(
    () => setI((n) => (n - 1 + ordered.length) % ordered.length),
    [ordered.length]
  );

  const next = useCallback(
    () => setI((n) => (n + 1) % ordered.length),
    [ordered.length]
  );

  if (!ordered.length)
    return <div className="aspect-[4/3] rounded-xl bg-black/50" />;

  const current = ordered[Math.min(i, ordered.length - 1)];

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-orange-700">
        {!errores.has(current) && (
          <img
            src={current}
            alt="Foto principal del vehículo"
            className="w-full h-full object-cover"
            onError={() => handleImgError(current)}
          />
        )}

        {/* Flechas */}
        {ordered.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white hover:bg-orange-600 transition-colors z-10"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white hover:bg-orange-600 transition-colors z-10"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {ordered.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
          {ordered.map((u, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className={`border rounded-md overflow-hidden transition-all duration-200 
                ${
                  idx === i
                    ? "ring-2 ring-orange-500 border-orange-600"
                    : "border-neutral-800 hover:border-orange-700"
                }`}
              aria-label={`Miniatura ${idx + 1}`}
            >
              {!errores.has(u) && (
                <img
                  src={u}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-16 object-cover"
                  onError={() => handleImgError(u)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
