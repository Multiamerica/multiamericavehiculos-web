"use client";
import { FaShareAlt } from "react-icons/fa";

type Props = {
  titulo: string;
  id: string;
  vendedor?: string;
};

export default function BotonCompartir({ titulo, id, vendedor }: Props) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://multiamerica.vercel.app";

  // ✅ Enlace con el asesor incluido
  const link = `${baseUrl}/v/${id}?asesor=${encodeURIComponent(
    vendedor || "general"
  )}`;

  const handleShare = async () => {
    const shareData = {
      title: `🚗 ${titulo}`,
      text: `Con MultiamericaVehiculos, C.A.\nAtendido por: ${
        vendedor || "nuestro equipo"
      }`,
      url: link,
    };

    try {
      if (navigator.share) {
        // 📱 Dispositivos móviles (uso del API nativo)
        await navigator.share(shareData);
      } else {
        // 💻 Escritorio: copia el enlace
        await navigator.clipboard.writeText(link);
        alert(`📋 Enlace copiado al portapapeles:\n${link}`);
      }
    } catch (err) {
      console.error("❌ Error al compartir:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-5 py-2.5 font-extrabold rounded-lg shadow-md transition-all duration-300 bg-orange-700 hover:bg-orange-600 text-white border border-orange-500"
    >
      <FaShareAlt size={18} />
      Compartir
    </button>
  );
}
