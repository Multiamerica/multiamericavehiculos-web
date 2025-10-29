"use client";
import { useState } from "react";

export default function TrabajaConNosotros() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    cv: null as File | null,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "cv" && files) {
      setForm({ ...form, cv: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.cv) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setStatus("sending");

    try {
      // 🔹 Aquí podrías enviar a un Google Apps Script o API tuya
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("email", form.email);
      formData.append("telefono", form.telefono);
      formData.append("ciudad", form.ciudad);
      if (form.cv) formData.append("cv", form.cv);

      // Enviar al Apps Script real
        await fetch("https://script.google.com/macros/s/AKfycbw6OAlu0KBv1lj9CDYZEgPnkZj2-CVBkYznqnonHugkKxiMooVBbkfmkPPZPcn1HIfh/exec", {
            method: "POST",
            body: formData,
        });

      setStatus("success");
      setForm({ nombre: "", email: "", telefono: "", ciudad: "", cv: null });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-400 mb-8 text-center">
          Trabaja con Nosotros
        </h1>

        <p className="text-neutral-300 text-lg mb-10 text-center">
          En <span className="text-orange-300 font-semibold">Multiamerica Vehículos</span> creemos en el talento local.
          Si quieres formar parte de nuestro equipo, completa el formulario y envíanos tu currículum.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-black/70 border border-orange-800 rounded-xl p-8 space-y-6 shadow-lg"
        >
          <div>
            <label className="block text-sm text-orange-300 mb-1">Nombre y Apellido *</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full bg-neutral-900 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 outline-none"
              placeholder="Ej: Gabriel García"
            />
          </div>

          <div>
            <label className="block text-sm text-orange-300 mb-1">Correo electrónico *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-neutral-900 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 outline-none"
              placeholder="Ej: gabrielgarcia@gmail.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-orange-300 mb-1">Número de contacto</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full bg-neutral-900 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 outline-none"
                placeholder="Ej: 0412 0000000"
              />
            </div>

            <div>
              <label className="block text-sm text-orange-300 mb-1">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                className="w-full bg-neutral-900 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 outline-none"
                placeholder="Ej: Caracas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-orange-300 mb-1">Currículum (PDF o Word) *</label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              onChange={handleChange}
              required
              className="w-full text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-orange-700 file:text-white hover:file:bg-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {status === "sending"
              ? "Enviando..."
              : status === "success"
              ? "✅ Enviado correctamente"
              : "Enviar solicitud"}
          </button>

          {status === "error" && (
            <p className="text-red-500 text-center mt-2">Hubo un error al enviar el formulario. Intenta nuevamente.</p>
          )}
        </form>
      </div>
    </section>
  );
}
