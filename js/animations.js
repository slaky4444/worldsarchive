/* ============================================================
   The Worlds Archive — animaciones y micro-interacciones
   Compartido por todas las páginas del sitio.
   ============================================================ */

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- Barra de progreso de scroll ---------- */
  function initScrollProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Resalta el enlace del menú de la página actual ---------- */
  function initNavActive() {
    var links = document.querySelectorAll("nav a");
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (here === "") here = "index.html";
    links.forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === here || (here === "index.html" && (href === "" || href === "#"))) {
        a.classList.add("active");
      }
    });
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  function initRevealAnimations() {
    var selector = [
      ".card", ".world-card", ".event", ".section",
      ".donation-section", ".contact-section"
    ].join(",");
    var targets = document.querySelectorAll(selector);
    if (!targets.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = Math.min(i % 6, 6) * 0.06 + "s";
      }
      io.observe(el);
    });
  }

  /* ---------- Inclinación 3D + brillo que sigue al ratón en las tarjetas ---------- */
  function initCardTilt() {
    var cards = document.querySelectorAll(".card, .world-card");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--rx", (x * 6).toFixed(2));
        card.style.setProperty("--ry", (-y * 6).toFixed(2));
        card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--rx", 0);
        card.style.setProperty("--ry", 0);
      });
    });
  }

  /* ---------- Efecto ripple en botones ---------- */
  function initRipple() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".button, .donate-button, .contact-button");
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement("span");
      var size = Math.max(rect.width, rect.height);
      ripple.className = "ripple-el";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 650);
    });
  }

  /* ---------- Transición suave al navegar entre páginas del sitio ---------- */
  function initPageTransitions() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (/^https?:\/\//i.test(href) || href.indexOf("mailto:") === 0) return;
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        document.body.classList.add("page-out");
        setTimeout(function () {
          window.location.href = href;
        }, 220);
      });
    });
  }

  ready(function () {
    initScrollProgress();
    initNavActive();
    initRevealAnimations();
    initCardTilt();
    initRipple();
    initPageTransitions();
  });
})();
