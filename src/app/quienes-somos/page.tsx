export default function QuienesSomos() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* 🟧 Título principal */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-4">
            ¿Quiénes Somos?
          </h1>
          <p className="text-neutral-300 text-lg max-w-3xl mx-auto">
            En <span className="text-orange-300 font-semibold">Multiamerica Vehículos</span>,
            creemos que comprar o vender un automóvil debe ser una experiencia confiable, segura y transparente.
          </p>
        </header>

        {/* 🧩 Sección: Nuestra historia */}
        <section>
          <h2 className="text-2xl font-semibold text-orange-300 mb-3">Nuestra Historia</h2>
          <p className="text-neutral-300 leading-7">
            Nacimos con el propósito de ofrecer a nuestros clientes un servicio integral en el mundo automotriz,
            combinando años de experiencia con una atención cercana y personalizada.
            Desde nuestros inicios, nos hemos consolidado como una empresa de confianza en la compra y venta de vehículos
            nuevos y usados en Venezuela.
          </p>
        </section>

        {/* 🚗 Sección: Qué ofrecemos */}
        <section>
          <h2 className="text-2xl font-semibold text-orange-300 mb-3">Qué Ofrecemos</h2>
          <ul className="list-disc list-inside text-neutral-300 space-y-2">
            <li>Asesoría profesional en compra y venta de vehículos.</li>
            <li>Revisión técnica y mecánica de cada unidad.</li>
            <li>Trámites legales y documentación al día.</li>
            <li>Oportunidades exclusivas y ofertas destacadas.</li>
          </ul>
        </section>

        {/* 🤝 Sección: Nuestra misión y visión */}
        <section className="grid md:grid-cols-2 gap-10 mt-10">
          <div>
            <h2 className="text-2xl font-semibold text-orange-300 mb-3">Nuestra Misión</h2>
            <p className="text-neutral-300 leading-7">
              Brindar soluciones confiables, rápidas y seguras en el mercado automotriz,
              garantizando la satisfacción de nuestros clientes con productos de calidad y un servicio profesional.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-orange-300 mb-3">Nuestra Visión</h2>
            <p className="text-neutral-300 leading-7">
              Ser reconocidos como una de las empresas líderes del país en comercialización de vehículos,
              destacando por nuestra transparencia, innovación y compromiso con el cliente.
            </p>
          </div>
        </section>

        {/* 👥 Sección: Nuestro compromiso */}
        <section>
          <h2 className="text-2xl font-semibold text-orange-300 mb-3">Nuestro Compromiso</h2>
          <p className="text-neutral-300 leading-7">
            En <span className="text-orange-400 font-semibold">Multiamerica Vehículos</span>, 
            trabajamos cada día para que cada cliente encuentre el vehículo ideal a un precio justo,
            con el respaldo de una empresa sólida y transparente.  
            Nuestra prioridad es que cada experiencia sea positiva, desde la primera visita hasta la entrega final.
          </p>
        </section>

        {/* 📍 Ubicación o contacto */}
        <section className="border-t border-orange-800 pt-8 mt-8 text-center">
          <p className="text-neutral-400 text-sm">
            📍 Nos encontramos en Caracas, Venezuela — Visítanos o contáctanos por{" "}
            <a
              href="https://wa.me/584223820482"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline"
            >
              WhatsApp
            </a>{" "}
            para más información.
          </p>
        </section>
      </div>
    </section>
  );
}
