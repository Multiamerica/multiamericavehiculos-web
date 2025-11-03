"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Oferta {
  titulo?: string;
  descripcion?: string;
  imagenes: string[];
}

export default function OfertasCarousel() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [ofertaIndex, setOfertaIndex] = useState(0);
  const [imagenIndex, setImagenIndex] = useState(0);

  // 🧠 Carga las ofertas desde tu Apps Script
  useEffect(() => {
    async function fetchOfertas() {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbx-ipJyt7LyDusmwDRsjD6_0JIojZDIWv0-t8YYj4-Lm7N9YKBdpijKiSl6u6itr3ZYOw/exec?action=ofertas"
        );
        const data = await res.json();

        if (data && data.items) {
          setOfertas(data.items.slice(0, 10)); // máximo 10
        } else {
          console.warn("Respuesta sin items:", data);
          setOfertas([]);
        }
      } catch (err) {
        console.error("Error cargando ofertas:", err);
      }
    }

    fetchOfertas();
  }, []);

  // ⏱ Cambiar automáticamente cada 10 s (cambia imagen o pasa a siguiente oferta)
  useEffect(() => {
    if (ofertas.length === 0) return;

    const timer = setInterval(() => {
      const actual = ofertas[ofertaIndex];
      const nextImg =
        (imagenIndex + 1) % (actual?.imagenes?.length || 1);

      if (nextImg === 0) {
        // pasa a la siguiente oferta
        setOfertaIndex((prev) => (prev + 1) % ofertas.length);
      }
      setImagenIndex(nextImg);
    }, 10000);

    return () => clearInterval(timer);
  }, [ofertas, ofertaIndex, imagenIndex]);

  if (ofertas.length === 0) return null;

  const oferta = ofertas[ofertaIndex];
  const imagenActual = oferta.imagenes[imagenIndex] || oferta.imagenes[0];

  // ▶️ Flechas manuales
  const prev = () => {
    if (imagenIndex > 0) setImagenIndex((prev) => prev - 1);
    else
      setOfertaIndex(
        (prev) => (prev - 1 + ofertas.length) % ofertas.length
      );
  };

  const next = () => {
    const actual = ofertas[ofertaIndex];
    if (imagenIndex < (actual?.imagenes?.length || 1) - 1)
      setImagenIndex((prev) => prev + 1);
    else
      setOfertaIndex(
        (prev) => (prev + 1) % ofertas.length
      );
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto mt-2 mb-4 rounded-2xl overflow-hidden border border-orange-700 shadow-lg">
      {/* 📸 Imagen principal */}
      <div className="relative h-[180px] md:h-[300px] lg:h-[200px]">
        <Image
          src={imagenActual}
          alt={oferta.titulo || "Oferta"}
          fill
          priority
          className="object-cover object-center w-full h-full transition-transform duration-700 ease-in-out hover:scale-105"
          sizes="(max-width: 768px) 100vw, 1200px"
        />

        {/* 🟧 Capa de texto sobre la imagen */}
        {(oferta.titulo || oferta.descripcion) && (
          <div className="absolute inset-0 bg-black/45 flex flex-col justify-center items-center text-center px-6">
            {oferta.titulo && (
              <h2 className="text-2xl md:text-4xl font-extrabold text-orange-400 drop-shadow-md">
                {oferta.titulo}
              </h2>
            )}
            {oferta.descripcion && (
              <p className="text-neutral-200 mt-2 text-lg">
                {oferta.descripcion}
              </p>
            )}
          </div>
        )}

        {/* ◀️ Flecha izquierda */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-orange-400 p-2 rounded-full transition"
        >
          <ChevronLeft size={28} />
        </button>

        {/* ▶️ Flecha derecha */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-orange-400 p-2 rounded-full transition"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* 🔸 Indicadores (puntos inferiores) */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {ofertas.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setOfertaIndex(i);
              setImagenIndex(0);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              i === ofertaIndex
                ? "bg-orange-500 scale-110"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
