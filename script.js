// Samaira Rana — portfolio interactions
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */
  var toggleBtn = document.querySelector(".theme-toggle");
  function getStoredTheme() {
    try { return localStorage.getItem("sr-theme"); } catch (e) { return null; }
  }
  function setStoredTheme(v) {
    try { localStorage.setItem("sr-theme", v); } catch (e) { /* ignore */ }
  }
  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (toggleBtn) {
      toggleBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }
  var stored = getStoredTheme();
  if (stored) applyTheme(stored);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var effectiveDark = current ? current === "dark" : prefersDark;
      var next = effectiveDark ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  /* ---------- mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("mobile-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("mobile-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- rotating role line ---------- */
  var roles = [
    "Digital Business & Data Science student",
    "full-stack builder (Python + Flask)",
    "Scrum Master, 9-person Agile team",
    "local-AI tinkerer (JARVIS)",
    "honest-evaluation-over-hype ML"
  ];
  var roleEl = document.querySelector("[data-role-text]");
  if (roleEl) {
    if (reduceMotion) {
      roleEl.textContent = roles[0];
    } else {
      var idx = 0;
      roleEl.textContent = roles[0];
      setInterval(function () {
        idx = (idx + 1) % roles.length;
        roleEl.style.opacity = "0";
        setTimeout(function () {
          roleEl.textContent = roles[idx];
          roleEl.style.opacity = "1";
        }, 260);
      }, 2600);
      roleEl.style.transition = "opacity 0.26s ease";
    }
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- confetti burst ---------- */
  var confettiColors = ["#8b5cf6", "#ff4fa3", "#ffb627", "#38bdf8", "#34d399"];
  function burstConfetti(x, y) {
    if (reduceMotion) return;
    var count = 22;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.background = confettiColors[i % confettiColors.length];
      piece.style.left = x + "px";
      piece.style.top = y + "px";
      document.body.appendChild(piece);

      var angle = Math.random() * Math.PI * 2;
      var distance = 60 + Math.random() * 90;
      var dx = Math.cos(angle) * distance;
      var dy = Math.sin(angle) * distance - 40;
      var rot = (Math.random() - 0.5) * 480;

      var anim = piece.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(" + dx + "px," + (dy + 140) + "px) rotate(" + rot + "deg)", opacity: 0 }
        ],
        { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.3,1)" }
      );
      anim.onfinish = function (p) {
        return function () { p.remove(); };
      }(piece);
    }
  }
  document.querySelectorAll("[data-confetti]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      burstConfetti(e.clientX, e.clientY);
    });
  });

  /* ---------- copy email ---------- */
  var copyBtn = document.querySelector("[data-copy-email]");
  var copyNote = document.querySelector("[data-copy-note]");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-copy-email");
      function done(ok) {
        if (copyNote) {
          copyNote.textContent = ok ? "Copied " + email + " to your clipboard!" : email;
        }
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------- footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
