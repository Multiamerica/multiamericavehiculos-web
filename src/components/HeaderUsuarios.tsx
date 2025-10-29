"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserMenu from "@/components/UserMenu";

export default function HeaderUsuarios() {
  const router = useRouter();
  const logoUrl = "https://i.imgur.com/z5eBDey.png";
  const [rolUsuario, setRolUsuario] = useState<string>("Invitado");

  // 🧠 Leer el rol guardado al iniciar sesión
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.rol) setRolUsuario(parsedUser.rol);
      }
    } catch (err) {
      console.error("Error al leer usuario del localStorage:", err);
    }
  }, []);

  // 🟢 Mantener estado del usuario sincronizado con Google Sheets
  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return;

    const userObj = JSON.parse(usuario);

    /** =====================================================
     * 🔄 Actualiza el estado (Activo / Inactivo / Online / Offline)
     * ===================================================== */
    async function actualizarEstado(estado: string, enLinea: string, reintentos = 3) {
      const url =
        "https://script.google.com/macros/s/AKfycbx0vrJhAg--Clu5iVu6JzksgqfrCHu4Rxl-Uhenw7tZRoelMN1oU5ETwQGHKRC-zAIy/exec";

      try {
        // 🔸 Evitamos CORS preflight usando x-www-form-urlencoded
        const formData = new URLSearchParams({
          cedula: userObj.cedula,
          estado,
          enLinea,
        });

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        let data: any;

        try {
          data = JSON.parse(text);
        } catch {
          console.warn("⚠️ Respuesta no JSON:", text);
          data = { success: false, message: text };
        }

        if (data.success) {
          console.log(`✅ Estado sincronizado: ${estado} / ${enLinea}`);
        } else {
          console.warn("⚠️ Error desde Apps Script:", data.message);
        }
      } catch (error) {
        console.error("❌ Error al conectar con Apps Script:", error);

        // 🔁 Reintentar hasta 3 veces
        if (reintentos > 0) {
          console.warn(`Reintentando (${4 - reintentos}/3)...`);
          setTimeout(() => actualizarEstado(estado, enLinea, reintentos - 1), 3000);
        }
      }
    }

    // 🔸 Al cargar → marcar Online
    actualizarEstado("Activo", "Online");

    // 🔁 Mantener el estado activo cada 60 segundos
    const intervalo = setInterval(() => {
      actualizarEstado("Activo", "Online");
    }, 60000);

    // 🔴 Al cerrar o refrescar pestaña → marcar solo Offline
    const handleBeforeUnload = () => actualizarEstado("Activo", "Offline");
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 🧹 Limpieza al desmontar el componente
    return () => {
      clearInterval(intervalo);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      actualizarEstado("Activo", "Offline");
    };
  }, []);

  /** =====================================================
   * 🚪 Cerrar sesión manualmente
   * ===================================================== */
  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        flex items-center justify-between
        bg-gradient-to-r from-black via-orange-900 to-black
        backdrop-blur-md
        px-6 py-3 border-b border-orange-700 shadow-md
      "
    >
      {/* 🔸 Logo y título */}
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
        <h1 className="text-lg md:text-xl font-extrabold text-orange-400 tracking-wide">
          MULTIAMERICAVEHICULOS, C.A.
        </h1>
      </Link>

      {/* 🔸 Menú de navegación */}
      <nav className="flex items-center gap-6">
        <Link
          href="/Usuarios/Reservado"
          className="text-orange-400 font-semibold hover:text-orange-500 transition"
        >
          Reservado
        </Link>
        <Link
          href="/Usuarios"
          className="text-orange-400 hover:text-white transition-colors font-medium"
        >
          Disponibles
        </Link>
        <Link
          href="/Usuarios/previa_cita/"
          className="text-orange-400 hover:text-white transition-colors font-medium"
        >
          Previa Cita
        </Link>

        {/* 🔸 Menú de usuario */}
        <UserMenu rol={rolUsuario as any} onLogout={handleCerrarSesion} />
      </nav>
    </header>
  );
}
