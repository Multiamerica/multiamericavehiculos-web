"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";

type Rol =
  | "Admin"
  | "Asesor"
  | "Comisionista"
  | "Gerente"
  | "Gerente de Guardia"
  | "Supervisor"
  | "Operaciones"
  | "Marketing";

interface Opcion {
  label: string;
  roles: Rol[] | "Todos";
  href?: string;
}

const OPCIONES: Opcion[] = [
  { label: "Recorrido", roles: "Todos", href: "/Usuarios/Base/Recorridos" },
];

interface Props {
  rol?: Rol;
  onLogout: () => void;
}

export default function UserMenu({ rol, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [rolActual, setRolActual] = useState<Rol | null>(rol || null);
  const [nombreUsuario, setNombreUsuario] = useState<string>("Usuario");
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🧠 Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.rango) setRolActual(userObj.rango as Rol);
        const nombre =
          userObj.nombreEjecutivo ||
          userObj.ejecutivo ||
          userObj.nombre ||
          userObj.nombreCompleto ||
          userObj.displayName ||
          "Usuario";
        setNombreUsuario(nombre);
      } catch {
        console.warn("⚠️ No se pudo leer el usuario desde localStorage");
      }
    }
    setMounted(true);
  }, []);

  // 🔸 Cerrar menús si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const visibleOptions = OPCIONES.filter((opt) => {
    if (!rolActual) return false;
    const rolNorm = rolActual.trim().toLowerCase();
    if (rolNorm === "admin") return true;
    if (opt.roles === "Todos") return true;
    return Array.isArray(opt.roles) && opt.roles.some((r) => r.toLowerCase() === rolNorm);
  });

  return (
    <div ref={menuRef} className="relative flex items-center gap-2 z-[9999]">
      {/* 👤 Menú de usuario */}
      <div className="relative">
        <button
          onClick={() => {
            setUserMenuOpen((prev) => !prev);
            if (!userMenuOpen) setOpen(false);
          }}
          className="flex items-center gap-2 bg-black hover:bg-orange-700 text-white px-3 py-2 rounded-md font-semibold shadow-md transition-all duration-300"
        >
          <User size={18} />
          {nombreUsuario}
        </button>

        {userMenuOpen && (
          <div
            className="absolute right-0 top-[110%] w-52 rounded-xl shadow-xl z-50
                       bg-gradient-to-b from-black via-gray-900 to-black
                       border border-orange-700/70 backdrop-blur-sm"
          >
            <ul className="py-2 text-sm text-gray-200">
              <li>
                <Link
                  href="/Usuarios/configuracion"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-orange-700/80 rounded-md transition"
                >
                  ⚙️ <span>Configuraciones</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-orange-700/80 rounded-md transition"
                >
                  📘 <span>Cerrar Sesión</span>
                </button>
              </li>

              {/* 🏷️ Mostrar rango del usuario */}
              {rolActual && (
                <>
                  <hr className="border-orange-700/40 my-2" />
                  <li className="px-4 py-1 text-xs text-center text-orange-400 font-semibold uppercase tracking-wide">
                    Rango: {rolActual}
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 🍔 Menú principal */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) setUserMenuOpen(false);
        }}
        className="p-2 rounded-md hover:bg-orange-700 bg-black text-white transition"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[110%] w-56 max-h-[300px] overflow-y-auto rounded-xl shadow-xl z-50
                     bg-gradient-to-b from-black via-gray-900 to-black border border-orange-700/70
                     backdrop-blur-sm scrollbar-thin scrollbar-thumb-orange-700/60 scrollbar-track-transparent"
        >
          <ul className="py-2">
            {visibleOptions.map((opt) => (
              <li key={opt.label}>
                <Link
                  href={opt.href || "#"}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-orange-700/80 hover:text-white transition-colors rounded-md mx-1"
                >
                  {opt.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
