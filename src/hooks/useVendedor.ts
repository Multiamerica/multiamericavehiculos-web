"use client";
import { useEffect, useState } from "react";
import { getVendedores, Vendedor } from "@/lib/sheets";

export function useVendedor() {
  const [vendedor, setVendedor] = useState<Vendedor | null>(null);

  useEffect(() => {
    async function detectarVendedor() {
      const params = new URLSearchParams(window.location.search);
      const tokenUrl = params.get("vendedor");

      const vendedores = await getVendedores();
      const buscarPorToken = (t: string | null) =>
        vendedores.find((v) => v.token === t);

      // 1️⃣ Token en URL
      if (tokenUrl) {
        const encontrado = buscarPorToken(tokenUrl);
        if (encontrado) {
          localStorage.setItem("vendedorAsignado", tokenUrl);
          await fetch(`/api/vendedorPorIp?vendedor=${tokenUrl}`);
          setVendedor(encontrado);
          return;
        }
      }

      // 2️⃣ LocalStorage
      const local = localStorage.getItem("vendedorAsignado");
      if (local) {
        const encontrado = buscarPorToken(local);
        if (encontrado) {
          setVendedor(encontrado);
          return;
        }
      }

      // 3️⃣ Buscar por IP (bonus)
      const resIp = await fetch(`/api/vendedorPorIp`);
      const dataIp = await resIp.json();
      if (dataIp.vendedor) {
        const encontrado = buscarPorToken(dataIp.vendedor);
        if (encontrado) {
          localStorage.setItem("vendedorAsignado", encontrado.token);
          setVendedor(encontrado);
          return;
        }
      }

      // 4️⃣ Asignar aleatorio
      if (vendedores.length > 0) {
        const aleatorio =
          vendedores[Math.floor(Math.random() * vendedores.length)];
        localStorage.setItem("vendedorAsignado", aleatorio.token);
        await fetch(`/api/vendedorPorIp?vendedor=${aleatorio.token}`);
        setVendedor(aleatorio);
      }
    }

    detectarVendedor();
  }, []);

  return vendedor;
}
