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
  /* ── 5. Gallery — spotlight color reveal + lightbox ─────── */

  var galleryItems = document.querySelectorAll(".gallery-item");

  // Photo manifest — mirrors the HTML order
  var PHOTOS = [
    { src: "assets/photos/photo-01.webp", alt: "Photograph 1" },
    { src: "assets/photos/photo-02.webp", alt: "Photograph 2" },
    { src: "assets/photos/photo-03.webp", alt: "Photograph 3" },
    { src: "assets/photos/photo-04.webp", alt: "Photograph 4" },
    { src: "assets/photos/photo-05.webp", alt: "Photograph 5" },
    { src: "assets/photos/photo-06.webp", alt: "Photograph 6" },
    { src: "assets/photos/photo-07.webp", alt: "Photograph 7" },
    { src: "assets/photos/photo-08.webp", alt: "Photograph 8" },
    { src: "assets/photos/photo-09.webp", alt: "Photograph 9" },
  ];
  var TOTAL = PHOTOS.length;

  /* ── Handle missing images ── */
  galleryItems.forEach(function (item) {
    var bwImg = item.querySelector(".gallery-item__bw");
    if (!bwImg) return;
    bwImg.addEventListener("error", function () {
      // Mark item as missing and clear child elements
      item.classList.add("gallery-item--missing");
      while (item.firstChild) {
        item.removeChild(item.firstChild);
      }
    });
  });

  /* ── Spotlight: cursor/touch-following color reveal ── */
  function attachSpotlight(item) {
    // Mouse enter
    item.addEventListener("mousemove", function (e) {
      var rect = item.getBoundingClientRect();
      item.style.setProperty("--x", (e.clientX - rect.left) + "px");
      item.style.setProperty("--y", (e.clientY - rect.top)  + "px");
    });

    item.addEventListener("mouseleave", function () {
      item.style.setProperty("--x", "-500px");
      item.style.setProperty("--y", "-500px");
    });

    // Touch move (passive — doesn't prevent scroll)
    item.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      var rect  = item.getBoundingClientRect();
      item.style.setProperty("--x", (touch.clientX - rect.left) + "px");
      item.style.setProperty("--y", (touch.clientY - rect.top)  + "px");
    }, { passive: true });

    item.addEventListener("touchend", function () {
      item.style.setProperty("--x", "-500px");
      item.style.setProperty("--y", "-500px");
    });
  }

  galleryItems.forEach(function (item) {
    if (!item.classList.contains("gallery-item--missing")) {
      attachSpotlight(item);
    }
  });

  /* ── Lightbox ── */
  var lightbox         = document.getElementById("lightbox");
  var lightboxImg      = document.getElementById("lightboxImg");
  var lightboxCounter  = document.getElementById("lightboxCounter");
  var lightboxColorBtn = document.getElementById("lightboxColorBtn");
  var lightboxClose    = document.getElementById("lightboxClose");
  var lightboxPrev     = document.getElementById("lightboxPrev");
  var lightboxNext     = document.getElementById("lightboxNext");
  var lightboxBackdrop = document.getElementById("lightboxBackdrop");

  var currentIndex = 0;  // which photo is shown
  var isColor      = false; // grayscale by default
  var lastFocused  = null;  // element to return focus to on close

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateLightboxContent() {
    var photo = PHOTOS[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    // Apply or remove the color class
    lightboxImg.className = "lightbox__img" +
      (isColor ? " lightbox__img--color" : "");
    // Update counter and button label
    lightboxCounter.textContent = pad(currentIndex + 1) + " / " + pad(TOTAL);
    lightboxColorBtn.textContent = isColor ? "View B&W" : "Toggle color";
  }

  function openLightbox(index) {
    currentIndex = index;
    isColor      = false;
    lastFocused  = document.activeElement;  // remember for focus-return

    updateLightboxContent();
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");

    // Move focus into the lightbox for keyboard users
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");

    // Return focus to the thumbnail that opened the lightbox
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + TOTAL) % TOTAL;
    isColor = false;
    updateLightboxContent();
  }

  // Open lightbox on click or keyboard activation of a gallery item
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      if (item.classList.contains("gallery-item--missing")) return;
      openLightbox(parseInt(item.dataset.index, 10));
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!item.classList.contains("gallery-item--missing")) {
          openLightbox(parseInt(item.dataset.index, 10));
        }
      }
    });
  });

  // Lightbox control buttons
  lightboxClose.addEventListener("click",    closeLightbox);
  lightboxBackdrop.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click",     function () { navigate(-1); });
  lightboxNext.addEventListener("click",     function () { navigate(1);  });

  lightboxColorBtn.addEventListener("click", function () {
    isColor = !isColor;
    lightboxImg.className = "lightbox__img" +
      (isColor ? " lightbox__img--color" : "");
    lightboxColorBtn.textContent = isColor ? "View B&W" : "Toggle color";
  });

  // Keyboard navigation: Esc, ←, →
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape")     { closeLightbox(); }
    if (e.key === "ArrowLeft")  { navigate(-1);    }
    if (e.key === "ArrowRight") { navigate(1);     }
  });

})();
