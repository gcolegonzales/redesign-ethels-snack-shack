/* Ethel's Snack Shack — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");
  var scrim = document.querySelector(".nav-scrim");

  /* ---- Mobile nav open/close ---- */
  function closeNav() {
    if (!navList || !navList.classList.contains("open")) return;
    navList.classList.remove("open");
    if (scrim) { scrim.classList.remove("open"); scrim.hidden = true; }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  }
  function openNav() {
    if (!navList) return;
    navList.classList.add("open");
    if (scrim) {
      scrim.hidden = false;
      // Unhide, force a reflow, then add .open so the fade-in transition runs.
      // Reflow (not rAF) so it works even when rAF is throttled.
      void scrim.offsetWidth;
      scrim.classList.add("open");
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }
  }

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      if (navList.classList.contains("open")) closeNav();
      else openNav();
    });

    // Close after clicking a link
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    // Close when tapping the scrim (page area)
    if (scrim) scrim.addEventListener("click", closeNav);

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---- Sticky header shadow + hide-on-scroll-down / reveal-on-scroll-up ---- */
  var lastScroll = window.scrollY || window.pageYOffset;
  var ticking = false;
  function updateHeader() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 20);

    // Reveal on ANY upward scroll; hide when scrolling down past the header.
    // Never hide while the mobile drawer is open.
    if (navList && navList.classList.contains("open")) {
      header.classList.remove("header-hidden");
    } else if (y < lastScroll || y <= header.offsetHeight) {
      header.classList.remove("header-hidden");   // scrolling up / near top
    } else if (y > lastScroll && y > header.offsetHeight) {
      header.classList.add("header-hidden");       // scrolling down
    }
    lastScroll = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  updateHeader();

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
