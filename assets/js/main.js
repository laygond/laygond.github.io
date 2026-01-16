/**
 * main.js — Vanilla JS version
 * Replaces jQuery + jquery.easing
 * Optimized for performance, accessibility, and Lighthouse
 */

(function () {
  "use strict";

  /* ============================
   Header scroll state
  ============================ */
  const header = document.getElementById("header");

  function updateHeader() {
    if (window.scrollY > 100) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  /* ============================
   Scroll offset (fixed header)
  ============================ */
  function getScrollOffset() {
    let offset = header ? header.offsetHeight - 21 : 0;
    if (window.matchMedia("(max-width: 991px)").matches) {
      offset += 20;
    }
    return offset;
  }

  /* ============================
   Smooth scrolling
  ============================ */
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href^='#']");
    if (!link) return;

    const targetId = link.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const offset = getScrollOffset();
    const targetPosition =
      targetId === "#header"
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Close mobile nav after click
    closeMobileNav();
  });

  /* ============================
   Mobile navigation
  ============================ */
  const navMenu = document.querySelector(".nav-menu");

  if (navMenu) {
    const mobileNav = navMenu.cloneNode(true);
    mobileNav.className = "mobile-nav d-lg-none";
    document.body.appendChild(mobileNav);

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "mobile-nav-toggle d-lg-none";
    toggleBtn.setAttribute("aria-label", "Toggle navigation");
    toggleBtn.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
    document.body.prepend(toggleBtn);

    const overlay = document.createElement("div");
    overlay.className = "mobile-nav-overly";
    document.body.appendChild(overlay);

    toggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-active");
      updateMobileIcon();
      overlay.style.display = document.body.classList.contains(
        "mobile-nav-active"
      )
        ? "block"
        : "none";
    });

    overlay.addEventListener("click", closeMobileNav);

    // Dropdowns
    mobileNav.querySelectorAll(".drop-down > a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        submenu.style.display =
          submenu.style.display === "block" ? "none" : "block";
        this.parentElement.classList.toggle("active");
      });
    });
  }

  function updateMobileIcon() {
    const icon = document.querySelector(".mobile-nav-toggle i");
    if (!icon) return;

    icon.className = document.body.classList.contains("mobile-nav-active")
      ? "fa fa-times"
      : "fa fa-bars";
  }

  function closeMobileNav() {
    if (!document.body.classList.contains("mobile-nav-active")) return;

    document.body.classList.remove("mobile-nav-active");
    updateMobileIcon();

    const overlay = document.querySelector(".mobile-nav-overly");
    if (overlay) overlay.style.display = "none";
  }

  // Close mobile nav on outside click
  document.addEventListener("click", function (e) {
    const nav = document.querySelector(".mobile-nav");
    const toggle = document.querySelector(".mobile-nav-toggle");

    if (
      document.body.classList.contains("mobile-nav-active") &&
      nav &&
      toggle &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  /* ============================
   Back to top button
  ============================ */
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.style.display = window.scrollY > 100 ? "block" : "none";
    });

    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ============================
   Hash scroll on page load
  ============================ */
  window.addEventListener("load", function () {
    if (!window.location.hash) return;

    const target = document.querySelector(window.location.hash);
    if (!target) return;

    const offset = getScrollOffset();
    const position =
      target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  });
})();
