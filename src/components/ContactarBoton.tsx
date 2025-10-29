"use client";
import { useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
  telefono?: string;
  ejecutivo?: string;
  vehiculo?: {
    marca?: string;
    modelo?: string;
    version?: string;
    anio?: number;
  };
};

export default function ContactarBoton({
  telefono = "",
  ejecutivo = "",
  vehiculo,
}: Props) {
  if (!vehiculo) return null;

  const mensaje = useMemo(() => {
    const texto = `Hola, vengo de la página de MultiamericaVehiculos por un ${
      vehiculo?.marca ?? ""
    } ${vehiculo?.modelo ?? ""} ${vehiculo?.version ?? ""} ${
      vehiculo?.anio ?? ""
    } y quiero más información.\n\nVendedor asignado: ${ejecutivo}`;
    return encodeURIComponent(texto);
  }, [vehiculo, ejecutivo]);

  const telefonoLimpio = telefono ? telefono.replace(/\D/g, "") : "";
  const link = telefonoLimpio
    ? `https://wa.me/58${telefonoLimpio}?text=${mensaje}`
    : "#";

  const handleClick = (e: React.MouseEvent) => {
    if (!telefonoLimpio) {
      e.preventDefault();
      return;
    }

    // ⚠️ Mostrar aviso antes de abrir WhatsApp
    alert(
      `📲 Vas a contactar al vendedor ${ejecutivo} por WhatsApp.\n\nPuedes desvincularte de este vendedor en cualquier momento usando el botón "Desvincular".`
    );
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 font-extrabold rounded-lg shadow-md transition-all duration-300 ${
        telefonoLimpio
          ? "hover:scale-105"
          : "bg-neutral-700 cursor-not-allowed text-gray-300"
      }`}
      style={
        telefonoLimpio
          ? {
              color: "#00FF84",
              backgroundColor: "#FF7A00",
              border: "2px solid #ff9f3d",
              textShadow: "0 0 5px #003300",
            }
          : {}
      }
    >
      <FaWhatsapp
        size={20}
        style={{ color: telefonoLimpio ? "#00FF84" : "#bbb" }}
      />
      {telefonoLimpio ? "WhatsApp" : "Teléfono no disponible"}
    </a>
  );
}
