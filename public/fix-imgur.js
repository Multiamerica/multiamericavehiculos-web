document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(img => {
    // Solo aplica a imágenes de Imgur
    if (img.src.includes("i.imgur.com")) {
      img.onerror = () => {
        // Si no carga, la reemplaza con el proxy seguro
        const proxy = "https://images.weserv.nl/?url=" + img.src.replace(/^https?:\/\//, "");
        console.warn("🟠 Reemplazando imagen bloqueada:", img.src, "→", proxy);
        img.src = proxy;
      };
    }
  });
});
