"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsuariosLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 🔍 Verificar sesión
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
      // 🚫 No hay sesión activa → redirige al login
      router.push("/Login/login.html");
    } else {
      try {
        const userObj = JSON.parse(usuario);
        if (!userObj.success || !userObj.nombreEjecutivo) {
          router.push("/Login/login.html");
        }
      } catch {
        router.push("/Login/login.html");
      }
    }
  }, [router]);

  return <>{children}</>;
}
