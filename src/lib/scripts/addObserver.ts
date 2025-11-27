//El fin de este script es centralizar un observer necesario
//para las transiciones de entrada en los componentes que lo requieran

document.addEventListener("astro:page-load", () => {
  const elements = document.querySelectorAll(".observe-enter");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add("animate-fadeIn");
        observer.unobserve(el);
      });
    },
    {
      root: null,
      threshold: 0.2,
      rootMargin: "10% 0px -10% 0px",
    },
  );

  elements.forEach((e) => observer.observe(e));
});
