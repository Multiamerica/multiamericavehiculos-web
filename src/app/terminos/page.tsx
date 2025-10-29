export default function TerminosCondiciones() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-white">
      <h1 className="text-4xl font-bold text-orange-400 mb-6">
        Términos y Condiciones
      </h1>

      <p className="text-neutral-300 mb-4">
        Bienvenido al sitio web de <b>Multiamerica Vehículos</b>. Al acceder o utilizar este sitio,
        usted acepta cumplir con los siguientes términos y condiciones.
      </p>

      <h2 className="text-2xl font-semibold text-orange-300 mt-8 mb-2">1. Uso del sitio</h2>
      <p className="text-neutral-300 mb-4">
        Este sitio está destinado únicamente para fines informativos y comerciales.
        Queda prohibido el uso indebido, copia no autorizada o modificación del contenido.
      </p>

      <h2 className="text-2xl font-semibold text-orange-300 mt-8 mb-2">2. Propiedad intelectual</h2>
      <p className="text-neutral-300 mb-4">
        Todos los textos, imágenes y logotipos son propiedad de Multiamerica Vehículos
        o sus respectivos titulares. No se permite su reproducción sin autorización.
      </p>

      <h2 className="text-2xl font-semibold text-orange-300 mt-8 mb-2">3. Responsabilidad</h2>
      <p className="text-neutral-300 mb-4">
        Multiamerica Vehículos no se hace responsable por daños derivados del uso o la imposibilidad de uso del sitio,
        ni por errores en la información mostrada.
      </p>

      <h2 className="text-2xl font-semibold text-orange-300 mt-8 mb-2">4. Cambios en los términos</h2>
      <p className="text-neutral-300 mb-4">
        Nos reservamos el derecho de modificar estos términos en cualquier momento. 
        Las modificaciones se publicarán en esta misma página.
      </p>

      <p className="text-neutral-400 text-sm mt-10">
        Última actualización: {new Date().toLocaleDateString("es-VE")}
      </p>
    </section>
  );
}
