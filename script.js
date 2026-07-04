/* Ethel's Snack Shack — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");
  var scrim = document.querySelector(".nav-scrim");
  var drawerClose = document.querySelector(".drawer-close");
  var main = document.querySelector("main");
  var footer = document.querySelector(".site-footer");
  var floatingCall = document.querySelector(".floating-call");
  var MOBILE_QUERY = "(max-width: 760px)";

  // Elements outside the drawer that get marked inert while it's open.
  var backgroundEls = [main, footer, floatingCall].filter(Boolean);

  // Move the drawer + scrim OUT of the sticky header ONCE on init.
  // The header uses backdrop-filter, which traps position:fixed descendants
  // in its containing block and re-paints them when the header transforms
  // (hide/reveal on scroll) — this caused the drawer to "double open" and the
  // page to wash out. Relocating to <body> escapes that containing block.
  // Done once (not on every open) so opening is a single clean transition.
  if (navList && navList.parentNode !== document.body) {
    document.body.appendChild(navList);
  }
  if (scrim && scrim.parentNode !== document.body) {
    document.body.appendChild(scrim);
  }

  /* ---- Mobile nav open/close ---- */
  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function getFocusable() {
    if (!navList) return [];
    return Array.prototype.filter.call(
      navList.querySelectorAll("a[href], button:not([disabled])"),
      function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      }
    );
  }

  // Keep the off-canvas drawer links out of the tab order when closed
  // (and always at desktop widths where the drawer isn't used).
  function syncDrawerTabbability() {
    if (!navList) return;
    var reachable = navList.classList.contains("open") || !isMobile();
    var links = navList.querySelectorAll("a");
    Array.prototype.forEach.call(links, function (a) {
      if (reachable) a.removeAttribute("tabindex");
      else a.setAttribute("tabindex", "-1");
    });
  }

  function setBackgroundInert(on) {
    backgroundEls.forEach(function (el) {
      if (on) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
  }

  function closeNav(returnFocus) {
    if (!navList || !navList.classList.contains("open")) return;
    navList.classList.remove("open");
    if (scrim) { scrim.classList.remove("open"); scrim.hidden = true; }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    setBackgroundInert(false);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    syncDrawerTabbability();
    if (returnFocus && toggle) toggle.focus();
  }
  function openNav() {
    if (!navList) return;
    // Ensure the header (which holds the X close control) is revealed even if
    // the menu is opened while scrolled down and the header was hidden.
    // updateHeader() only runs on scroll, so reveal it explicitly here (G1).
    if (header) header.classList.remove("header-hidden");
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
    setBackgroundInert(true);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    syncDrawerTabbability();
    // Move focus into the drawer (first link) WITHOUT scrolling the page.
    // Plain .focus() would scroll the focused element into view and jump the page.
    var focusable = getFocusable();
    if (focusable.length) {
      try { focusable[0].focus({ preventScroll: true }); }
      catch (err) { focusable[0].focus(); }
    }
  }

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      if (navList.classList.contains("open")) closeNav(true);
      else openNav();
    });

    // Close after clicking a link
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav(false);
    });

    // Close when tapping the scrim (page area)
    if (scrim) scrim.addEventListener("click", function () { closeNav(true); });

    // In-panel close (X) button
    if (drawerClose) drawerClose.addEventListener("click", function () { closeNav(true); });

    // Close on Escape; trap Tab within the drawer while open.
    document.addEventListener("keydown", function (e) {
      if (!navList.classList.contains("open")) return;
      if (e.key === "Escape") {
        closeNav(true);
        return;
      }
      if (e.key === "Tab") {
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;
        // If focus somehow escaped the drawer, pull it back in.
        if (!navList.contains(active)) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Reset drawer + toggle state when crossing the desktop breakpoint.
    var mql = window.matchMedia(MOBILE_QUERY);
    var onBreakpoint = function () {
      if (!isMobile()) closeNav(false);
      syncDrawerTabbability();
    };
    if (mql.addEventListener) mql.addEventListener("change", onBreakpoint);
    else if (mql.addListener) mql.addListener(onBreakpoint);

    // Initial state: keep hidden drawer links out of tab order on mobile.
    syncDrawerTabbability();
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
