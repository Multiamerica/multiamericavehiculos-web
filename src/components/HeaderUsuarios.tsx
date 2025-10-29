"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import UserMenu from "@/components/UserMenu";

export default function HeaderUsuarios() {
  const router = useRouter();
  const logoUrl = "https://i.imgur.com/z5eBDey.png";

  const [usuarioNombre, setUsuarioNombre] = useState<string>("Invitado");
  const [menuOpen, setMenuOpen] = useState(false);

  // 🧠 Cargar datos del usuario
  useEffect(() => {
    try {
      const stored = localStorage.getItem("usuario");
      if (stored) {
        const u = JSON.parse(stored);
        const nombre =
          u?.nombre ||
          u?.nombreCompleto ||
          u?.displayName ||
          u?.usuario?.nombre ||
          u?.user?.name ||
          u?.name ||
          u?.ejecutivo ||
          "Invitado";
        setUsuarioNombre(String(nombre));
      }
    } catch (e) {
      console.error("Error leyendo usuario:", e);
    }
  }, []);

  // 🚪 Cerrar sesión
  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
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
        href="/Usuarios"
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

      {/* 🔹 Navegación principal + Menús */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* 🌐 Enlaces principales (solo desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/Usuarios"
            className="text-orange-400 hover:text-white font-medium"
          >
            Disponibles
          </Link>
          <Link
            href="/Usuarios/previa_cita"
            className="text-orange-400 hover:text-white font-medium"
          >
            Previa Cita
          </Link>
          <Link
            href="/Usuarios/Reservado"
            className="text-orange-400 hover:text-white font-medium"
          >
            Reservado
          </Link>
        </nav>

        {/* 👤 UserMenu visible SIEMPRE */}
        <div className="hidden md:flex">
          <UserMenu onLogout={handleCerrarSesion} />
        </div>

        {/* 🍔 Botón menú móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-black hover:bg-orange-700 text-white p-2 rounded-md transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 📱 Menú móvil */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 border-t border-orange-700 shadow-lg z-40 md:hidden backdrop-blur-sm">
          <div className="flex flex-col p-4 space-y-4 text-orange-400 font-medium">
            {/* 🔹 Enlaces principales */}
            <Link
              href="/Usuarios"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white transition"
            >
              Disponibles
            </Link>
            <Link
              href="/Usuarios/previa_cita"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white transition"
            >
              Previa Cita
            </Link>
            <Link
              href="/Usuarios/Reservado"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white transition"
            >
              Reservado
            </Link>

            <hr className="border-orange-700/50 my-2" />

            {/* 👤 UserMenu también disponible en móvil */}
            <div className="flex justify-center">
              <UserMenu onLogout={handleCerrarSesion} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
