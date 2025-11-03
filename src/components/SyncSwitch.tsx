"use client";
import { useEffect, useState } from "react";

export default function SyncSwitch() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const json = await res.json();
        setEnabled(!!json.syncEnabled);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ syncEnabled: next }),
    });
  }

  if (loading) return <div className="text-neutral-400">Cargando…</div>;

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-lg border ${
        enabled ? "bg-green-600/30 border-green-500" : "bg-neutral-800 border-neutral-700"
      }`}
      title="Activar/desactivar envío a la base de datos"
    >
      {enabled ? "Sincronización: ACTIVADA" : "Sincronización: DESACTIVADA"}
    </button>
  );
}
