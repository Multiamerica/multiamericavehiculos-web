"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { FaWhatsapp, FaEnvelope, FaTools } from "react-icons/fa";

export default function SoporteTecnicoPage() {
  // 📧 Links según dispositivo
  const MAILTO =
    "mailto:multiamericavehiculos2025@gmail.com?subject=Soporte%20Técnico%20-%20MultiamericaVehículos&body=Hola%2C%20necesito%20ayuda%20con%20la%20página%20web.";
  const GMAIL =
    "https://mail.google.com/mail/?view=cm&fs=1&to=multiamericavehiculos2025@gmail.com&su=Soporte%20Técnico%20-%20MultiamericaVehículos&body=Hola%2C%20necesito%20ayuda%20con%20la%20página.";

  const [emailHref, setEmailHref] = useState(MAILTO);
  const [emailTarget, setEmailTarget] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Detectar si es teléfono o PC
    const ua =
      navigator.userAgent ||
      (navigator as any).vendor ||
      (window as any).opera ||
      "";
    const isMobileUA = /android|iphone|ipad|ipod|iemobile|blackberry|opera mini|mobile/i.test(
      ua.toLowerCase()
    );
    const isSmallScreen =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 767px)").matches;

    const isPhone = isMobileUA || isSmallScreen;

    // 📱 Teléfono → mailto | 💻 PC → Gmail web
    const href = isPhone ? MAILTO : GMAIL;
    setEmailHref(href);
    setEmailTarget(href.startsWith("http") ? "_blank" : undefined);
  }, []);

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center py-16 sm:py-20 px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-2xl bg-neutral-900/80 border border-orange-800 rounded-2xl shadow-lg p-6 sm:p-10 text-center">
        {/* 🧰 Encabezado */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <FaTools className="text-orange-500 text-4xl sm:text-5xl" />
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-400">
            Soporte Técnico
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed px-2 sm:px-6">
            Estás en contacto con el equipo de soporte técnico de{" "}
            <span className="text-orange-400 font-semibold">
              MultiamericaVehículos
            </span>
            . Nuestro objetivo es ayudarte a resolver cualquier duda o
            inconveniente relacionado con el uso de la página o el catálogo de
            vehículos.
          </p>
        </div>

        {/* 📞 Medios de contacto */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-10">
          {/* WhatsApp */}
          <div className="flex-1 bg-neutral-800/60 p-5 rounded-lg border border-neutral-700 hover:border-orange-700 transition-all duration-300">
            <FaWhatsapp className="text-green-500 text-3xl mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-orange-400">WhatsApp</h2>
            <p className="text-neutral-300 text-sm mt-1">
              Escríbenos para asistencia directa o soporte inmediato.
            </p>
            <a
              href="https://wa.me/584223820482?text=Hola%2C%20necesito%20ayuda%20con%20la%20página%20de%20MultiamericaVehículos."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300"
            >
              Contactar por WhatsApp
            </a>
          </div>

          {/* Correo */}
          <div className="flex-1 bg-neutral-800/60 p-5 rounded-lg border border-neutral-700 hover:border-orange-700 transition-all duration-300">
            <FaEnvelope className="text-orange-400 text-3xl mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-orange-400">
              Correo Electrónico
            </h2>
            <p className="text-neutral-300 text-sm mt-1">
              Escríbenos detallando tu problema o sugerencia:
            </p>
            <a
              href={emailHref}
              target={emailTarget}
              rel={emailTarget ? "noopener noreferrer" : undefined}
              className="inline-block mt-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300"
            >
              Enviar correo
            </a>

            {/* 📋 Mostrar y copiar correo */}
            <div className="mt-3 text-xs text-neutral-400">
              Correo de soporte:{" "}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    "multiamericavehiculos2025@gmail.com"
                  )
                }
                className="text-orange-400 hover:text-orange-300 font-semibold"
                title="Copiar correo"
              >
                multiamericavehiculos2025@gmail.com
              </button>
            </div>
          </div>
        </div>

        {/* 🧾 Nota final */}
        <p className="text-neutral-400 text-xs sm:text-sm mt-10 italic px-4">
          Nuestro equipo responderá tu solicitud lo antes posible. Gracias por
          confiar en{" "}
          <span className="text-orange-400">MultiamericaVehículos</span>.
        </p>
      </div>
    </section>
  );
}
