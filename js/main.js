(function () {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMobileNav() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileNav();
    });
  }

  document.querySelectorAll(".reveal").forEach((el, index) => {
    if (!el.style.getPropertyValue("--reveal-delay")) {
      el.style.setProperty("--reveal-delay", `${Math.min(index * 0.08, 0.4)}s`);
    }
  });

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  if (!prefersReduced) {
    const parallax = document.querySelector("[data-parallax]");
    if (parallax) {
      window.addEventListener(
        "scroll",
        () => {
          const offset = window.scrollY * 0.06;
          parallax.style.transform = `translate3d(0, ${offset}px, 0)`;
        },
        { passive: true }
      );
    }

    document.querySelectorAll(".stat strong").forEach((stat) => {
      const target = parseInt(stat.textContent, 10);
      if (Number.isNaN(target)) return;
      const suffix = stat.textContent.replace(String(target), "");
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const tick = () => {
        current += step;
        if (current >= target) {
          stat.textContent = target + suffix;
          return;
        }
        stat.textContent = current + suffix;
        requestAnimationFrame(tick);
      };
      const statObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          tick();
          statObserver.disconnect();
        }
      });
      statObserver.observe(stat);
    });
  }
})();
