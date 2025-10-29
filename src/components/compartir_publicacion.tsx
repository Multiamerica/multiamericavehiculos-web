"use client";
import { FaShareAlt } from "react-icons/fa";

type Props = {
  titulo: string;
  id: string;
  vendedor?: string;
};

export default function BotonCompartir({ titulo, id, vendedor = "" }: Props) {
  const link = `https://multiamerica.vercel.app/v/${id}`;

  const handleShare = async () => {
    const text = `🚗 ${titulo}\n🔸 Publicado por: ${vendedor}\n${link}`;
    if (navigator.share) {
      await navigator.share({
        title: titulo,
        text,
        url: link,
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert("🔗 Enlace copiado al portapapeles");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-5 py-2.5 font-extrabold rounded-lg shadow-md transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: "#FF7A00", // 🟠 fondo naranja
        color: "#ffffffff", 
        border: "2px solid #000000ff",
        textShadow: "0 0 5px #000000ff",
      }}
    > 
      <FaShareAlt size={15} style={{ color: "#ffffffff" }} />
      Compartir
    </button>
  );
}
