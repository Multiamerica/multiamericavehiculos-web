"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const logoUrl = "https://i.imgur.com/z5eBDey.png";
  const pathname = usePathname() ?? "";
  const esVistaUsuarios = pathname.startsWith("/usuarios");

  const [menuAbierto, setMenuAbierto] = useState(false);

  // 🚪 Cerrar sesión
  const handleCerrarSesion = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario");
        alert("Sesión cerrada correctamente");
        window.location.href = "/Login/login.html";
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        flex flex-wrap items-center justify-between
        bg-gradient-to-r from-black via-orange-900 to-black
        backdrop-blur-md border-b border-orange-700 shadow-md
        px-4 sm:px-6 py-3
      "
    >
      {/* 🔸 Logo + Nombre */}
      <Link
        href={esVistaUsuarios ? "/usuarios" : "/"}
        className="flex items-center gap-3 hover:opacity-90 transition"
      >
        <Image
          src={logoUrl}
          alt="Logo Multiamerica Vehículos"
          width={45}
          height={45}
          className="object-contain"
        />
        <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-orange-400 tracking-wide">
          MULTIAMERICAVEHICULOS, C.A.
        </h1>
      </Link>

      {/* 🔹 Botón menú móvil */}
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="md:hidden text-orange-400 hover:text-white focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {menuAbierto ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 🔹 Menú principal */}
      <nav
        className={`
          w-full md:w-auto md:flex items-center gap-6
          ${menuAbierto ? "block mt-4" : "hidden md:flex"}
        `}
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link
            href={esVistaUsuarios ? "/usuarios" : "/"}
            className="text-orange-400 hover:text-white transition-colors font-medium"
            onClick={() => setMenuAbierto(false)}
          >
            Disponibles
          </Link>

          <Link
            href="/previa_cita"
            className="text-orange-400 hover:text-white transition-colors font-medium"
            onClick={() => setMenuAbierto(false)}
          >
            Previa Cita
          </Link>

          {/* 🔐 Acceso / Cerrar sesión */}
          {esVistaUsuarios ? (
            <button
              onClick={handleCerrarSesion}
              className="
                bg-black hover:bg-[#fc6500]
                text-white text-sm sm:text-base font-bold
                px-4 py-2 rounded-md shadow-md transition-all duration-300
              "
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link
              href="/Login/login.html"
              onClick={() => setMenuAbierto(false)}
              className="
                bg-black hover:bg-[#fc6500]
                text-white text-sm sm:text-base font-bold
                px-4 py-2 rounded-md shadow-md transition-all duration-300
              "
            >
              Acceder
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
