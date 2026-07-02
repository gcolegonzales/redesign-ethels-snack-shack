/* Ethel's Snack Shack — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");

  /* ---- Sticky header shadow on scroll ---- */
  var lastScroll = -1;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if ((y > 20) !== (lastScroll > 20)) {
      header.classList.toggle("scrolled", y > 20);
    }
    lastScroll = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close after clicking a link
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("open")) {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Catering form (not wired to a backend — friendly confirmation) ---- */
  var form = document.querySelector(".catering-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var nameField = form.querySelector("#c-name");
      var name = nameField && nameField.value ? nameField.value.trim().split(" ")[0] : "";
      if (status) {
        status.hidden = false;
        status.textContent = name
          ? "Thank you, " + name + "! We'll call you back to confirm your order. For anything urgent, ring (225) 465-4512."
          : "Thank you! We'll call you back to confirm your order. For anything urgent, ring (225) 465-4512.";
        status.focus && status.focus();
      }
      form.reset();
    });
  }
})();
