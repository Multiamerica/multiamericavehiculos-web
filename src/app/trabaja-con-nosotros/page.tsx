"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

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
      // 🧠 Convertir el archivo a Base64
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

      const dataUrl = await toBase64(form.cv);
      const [meta, base64] = dataUrl.split(",");
      const mimeMatch = meta.match(/^data:(.+);base64$/);
      const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

      const payload = {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        ciudad: form.ciudad,
        cv: {
          nombre: form.cv.name,
          tipo: mimeType,
          base64: base64,
        },
      };

      // 🚀 Enviar al proxy interno
      const res = await fetch("/api/enviar-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (json.success) {
        console.log("✅ Archivo subido correctamente");
        setStatus("success");
      } else {
        console.error("❌ Error:", json.error);
        setStatus("error");
      }

      setForm({ nombre: "", email: "", telefono: "", ciudad: "", cv: null });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white py-20 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-neutral-900/70 border border-orange-800 rounded-2xl p-10 shadow-2xl backdrop-blur-sm"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold text-center text-orange-400 mb-6"
        >
          Trabaja con Nosotros
        </motion.h1>

        <p className="text-center text-neutral-300 text-lg mb-10 leading-relaxed">
          En <span className="text-orange-300 font-semibold">Multiamerica Vehículos</span> creemos en el talento local.  
          Completa el formulario y forma parte de nuestro equipo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos de texto */}
          {[
            { label: "Nombre y Apellido *", name: "nombre", type: "text", placeholder: "Ej: Gabriel García" },
            { label: "Correo electrónico *", name: "email", type: "email", placeholder: "Ej: gabrielgarcia@gmail.com" },
          ].map((input, i) => (
            <motion.div key={i} whileFocus={{ scale: 1.02 }}>
              <label className="block text-sm text-orange-300 mb-2">{input.label}</label>
              <input
                type={input.type}
                name={input.name}
                value={(form as any)[input.name]}
                onChange={handleChange}
                required
                className="w-full bg-neutral-900/80 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                placeholder={input.placeholder}
              />
            </motion.div>
          ))}

          {/* Campos en grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-orange-300 mb-2">Número de contacto</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full bg-neutral-900/80 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                placeholder="Ej: 0412 0000000"
              />
            </div>
            <div>
              <label className="block text-sm text-orange-300 mb-2">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                className="w-full bg-neutral-900/80 text-white p-3 rounded-lg border border-orange-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-600 outline-none transition-all"
                placeholder="Ej: Caracas"
              />
            </div>
          </div>

          {/* Archivo */}
          <div>
            <label className="block text-sm text-orange-300 mb-2">Currículum (PDF o Word) *</label>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
              className="w-full text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-orange-700 file:text-white hover:file:bg-orange-600 transition-colors"
            />
          </div>

          {/* Botón */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={status === "sending"}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all
            ${
              status === "success"
                ? "bg-green-600 hover:bg-green-500"
                : status === "error"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            {status === "sending" && <><FaPaperPlane className="animate-pulse" /> Enviando...</>}
            {status === "success" && <><FaCheckCircle /> Enviado correctamente</>}
            {status === "error" && <><FaExclamationTriangle /> Error al enviar</>}
            {status === "idle" && <><FaPaperPlane /> Enviar solicitud</>}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
