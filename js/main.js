/* ============================================================
   PORTFOLIO – main.js
   Handles:
   1. Navbar scroll state (adds .scrolled class)
   2. Hamburger menu open / close
   3. Close mobile menu when a nav link is clicked
   4. Scroll-reveal animation via IntersectionObserver
   ============================================================ */

(function () {
  "use strict";

  /* ── Element references ─────────────────────────────────── */
  const navbar     = document.getElementById("navbar");
  const hamburger  = document.getElementById("hamburger");
  const navMenu    = document.getElementById("navMenu");
  const navLinks   = navMenu.querySelectorAll(".nav-link");

  /* ── 1. Navbar scroll state ─────────────────────────────── */
  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Run once on load in case page is already scrolled
  handleScroll();

  /* ── 2. Hamburger toggle ────────────────────────────────── */
  function openMenu() {
    navMenu.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    navMenu.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = navMenu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener("click", toggleMenu);

  /* ── 3. Close menu when a nav link is clicked ───────────── */
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ── 4. Close menu on outside click ────────────────────── */
  document.addEventListener("click", function (e) {
    const clickedInsideNav = navMenu.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (!clickedInsideNav && !clickedHamburger) {
      closeMenu();
    }
  });

  /* ── 4. Scroll-reveal (IntersectionObserver) ─────────── */

  // If the user prefers reduced motion, skip the animation entirely
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    // Make all reveal elements immediately visible
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Unobserve after revealing – animation only plays once
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12, // trigger when 12% of the element is visible
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

})();
