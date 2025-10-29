import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (n: number) => void;
}

export default function Paginacion({
  paginaActual,
  totalPaginas,
  cambiarPagina,
}: Props) {

  console.log("📄 Renderizando paginación, totalPaginas:", totalPaginas); // <--- agrega esto

  // ⚠️ ESTE ES EL PROBLEMA MÁS COMÚN
  // if (!totalPaginas || totalPaginas < 2) return null;
  // 🔸Cámbialo por:
  if (!totalPaginas) return null; // así nunca se esconde cuando totalPaginas >= 1

  const paginas: (number | string)[] = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= paginaActual - 2 && i <= paginaActual + 2)) {
      paginas.push(i);
    } else if (paginas[paginas.length - 1] !== "...") {
      paginas.push("...");
    }
  }

  const btnCls =
    "px-3 py-1 rounded-md bg-black/50 hover:bg-orange-700 text-white disabled:opacity-40";

  return (
    <div className="flex justify-center items-center flex-wrap gap-2 my-4 text-orange-500 font-semibold">
      <button
        onClick={() => paginaActual > 1 && cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className={btnCls}
      >
        <ChevronLeft size={16} />
      </button>

      {paginas.map((num, idx) =>
        typeof num === "number" ? (
          <button
            key={idx}
            onClick={() => cambiarPagina(num)}
            className={`px-3 py-1 rounded-md ${
              num === paginaActual
                ? "bg-orange-600 text-white"
                : "bg-black/50 hover:bg-orange-700 text-white"
            }`}
          >
            {num}
          </button>
        ) : (
          <span key={idx} className="px-2">…</span>
        )
      )}

      <button
        onClick={() => paginaActual < totalPaginas && cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className={btnCls}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
