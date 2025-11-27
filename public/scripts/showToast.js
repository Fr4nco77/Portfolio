export default function showToast({
  title,
  message,
  type = "default",
}) {
  const container = document.getElementById("toaster");

  const toast = document.createElement("div");
  toast.className =
    `w-72 px-4 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-500 ` +
    (type === "success"
      ? "bg-green-600 text-white"
      : type === "error"
        ? "bg-red-600 text-white"
        : type === "info"
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-white");

  toast.innerHTML = `
      <h4 class="font-semibold text-sm">${title}</h4>
      <p class="text-sm opacity-90">${message}</p>
    `;

  container?.appendChild(toast);

  // Animación de entrada
  requestAnimationFrame(() => {
    toast.classList.remove("translate-x-full", "opacity-0");
  });

  // Animación de salida
  setTimeout(() => {
    toast.classList.remove("translate-x-0", "opacity-100");
    toast.classList.add("-translate-y-full", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
