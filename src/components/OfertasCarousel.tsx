"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Oferta {
  titulo: string;
  descripcion?: string;
  imagen: string;
}

export default function OfertasCarousel() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [index, setIndex] = useState(0);

  // 🧠 Carga las ofertas desde tu Apps Script
  useEffect(() => {
    async function fetchOfertas() {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxAi0b1sdZdkIUXLsRkodJLVB3Z2-bmxpkyyzz7Esvqziw8WutlT-MOPYABJwCcXMkM/exec?action=ofertas"
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

  // ⏱ Cambiar automáticamente cada 10 s
  useEffect(() => {
    if (ofertas.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ofertas.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [ofertas]);

  if (ofertas.length === 0) return null;

  const oferta = ofertas[index];

  // ▶️ Flechas manuales
  const prev = () =>
    setIndex((prev) => (prev - 1 + ofertas.length) % ofertas.length);
  const next = () =>
    setIndex((prev) => (prev + 1) % ofertas.length);

  return (
    <section className="relative w-230 max-w-5xl mx-auto mt-2 mb-4 rounded-2xl overflow-hidden border border-orange-700 shadow-lg">
      {/* 📸 Imagen principal */}
      <div className="relative h-[180px] md:h-[300px] lg:h-[200px]">
        <Image
          src={oferta.imagen}
          alt={oferta.titulo}
          fill
          priority
          className="object-cover object-center w-full h-full transition-transform duration-700 ease-in-out hover:scale-105"
          sizes="(max-width: 768px) 100vw, 1200px"
        />

        {/* 🟧 Capa de texto sobre la imagen */}
        <div className="absolute inset-0 bg-black/45 flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-orange-400 drop-shadow-md">
            {oferta.titulo}
          </h2>

          {oferta.descripcion && (
            <p className="text-neutral-200 mt-2 text-lg">
              {oferta.descripcion}
            </p>
          )}
        </div>

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
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-orange-500 scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}