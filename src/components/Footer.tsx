"use client";

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBriefcase,
  FaTiktok,
  FaRegClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-12 bg-black/90 border-t border-orange-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
        {/* 🏢 Columna 1: Información general */}
        <div>
          <h3 className="text-orange-400 text-2xl font-semibold mb-2">
            MULTIAMERICAVEHICULOS, C.A.
          </h3>
          <h1 className="text-orange-500 text-lg leading-1 mb-4">
            “Más que un concesionario“
          </h1>
          <p className="text-sm text-neutral-300 leading-6">
            Más de 15 años de experiencia en compra, venta y consignación de vehículos usados en Caracas. Contamos con un amplio inventario de 150 vehículos en exhibición permanente y más de 80 asesores de ventas calificados para ofrecerte atención personalizada.
          </p>
          <p className="text-sm text-neutral-400 mt-3">RIF: J-40881100-6</p>
        </div>

        {/* 📍 Columna 2: Enlaces importantes */}
        <div>
          <h3 className="text-orange-400 text-lg font-semibold mb-3">
            Enlaces
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/terminos"
                className="hover:text-orange-400 transition-colors"
              >
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a
                href="/privacidad"
                className="hover:text-orange-400 transition-colors"
              >
                Política de Privacidad
              </a>
            </li>
            <li>
              <a
                href="/quienes-somos"
                className="hover:text-orange-400 transition-colors"
              >
                Quiénes Somos
              </a>
            </li>
            <li>
              <a
                href="https://maps.app.goo.gl/J3AJoomRFtArsWBC6"
                className="hover:text-orange-400 transition-colors"
              >
                Ubicación: Avenida Principal de Quinta Crespo, Edificio Autopremiun, Caracas, Venezuela
              </a>
            </li>
            <li>
              <a
                href="/trabaja-con-nosotros"
                className="hover:text-orange-400 transition-colors"
              >
                Trabaja con Nosotros
              </a>
            </li>
          </ul>
        </div>

        {/* 💬 Columna 3: Contacto y redes */}
        <div>
          <h3 className="text-orange-400 text-lg font-semibold mb-3">
            Contáctanos
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500" />
              <a
                href="https://wa.me/584223820482"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                +58 422-3820482
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-orange-400" />
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=multiamericavehiculos2025@gmail.com&su=Consulta%20de%20vehículo&body=Hola%2C%20me%20interesa%20saber%20más%20sobre%20el%20inventario"
                className="hover:text-orange-400 transition-colors"
              >
                multiamericavehiculos2025@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-4">
              <FaRegClock className="text-orange-400" />
              <a className="hover:text-orange-400 transition-colors">
                Lunes a Viernes: 9:00 a.m. - 5:00 p.m.
              </a>
            </li>
            <li className="flex items-center gap-3 mt-3">
              <a
                href="https://www.instagram.com/multiamericavehiculos"
                className="hover:text-orange-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/multiamericavehiculosQC"
                className="hover:text-orange-400 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/discover/multiamericavehiculos"
                className="hover:text-orange-400 transition-colors"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://www.instagram.com/felixcar_94/"
                className="hover:text-orange-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
            </li>
              {/* Soporte Técnico */}
              <li className="mt-5">
                <a
                  href="/soporte_tecnico"
                >
                  🛠️Soporte Técnico
              </a>
              </li>
          </ul>
        </div>
      </div>
      {/* 🔸 Línea inferior */}
      <div className="border-t border-orange-800 py-4 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} MultiamericaVehículos — Desarrollado por{" "}
        <a href="https://www.youtube.com/@gabox94">
          <span className="text-orange-400">Gabox94</span>
        </a>.
      </div>
    </footer>
  );
}
