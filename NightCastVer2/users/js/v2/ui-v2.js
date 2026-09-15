/**
 * NightCast V2 — UI enhancements
 * Connects new presentation layer to existing functionality.
 * Does NOT replace API, Auth, or Player logic.
 */
(function () {
  "use strict";

  const UI = {
    init() {
      this.bindBottomNav();
      this.bindProfileNav();
      this.observePlayer();
      this.enhanceCards();
      console.log("NightCast V2 UI ready");
    },

    bindBottomNav() {
      const nav = document.querySelector(".mobile-nav");
      if (!nav) return;

      nav.addEventListener("click", (e) => {
        const link = e.target.closest("a[data-nav]");
        if (!link) return;

        const target = link.getAttribute("data-nav");

        // Profile opens existing overlay
        if (target === "profile") {
          e.preventDefault();
          const loginBtn = document.getElementById("loginBtn");
          if (loginBtn) loginBtn.click();
          this.setActiveNav(link);
          return;
        }

        // Favorites — try to trigger existing favorites if present
        if (target === "favorites") {
          e.preventDefault();
          // If profile favorites section exists, open profile then scroll
          const loginBtn = document.getElementById("loginBtn");
          if (loginBtn) loginBtn.click();
          setTimeout(() => {
            const favSection = document.getElementById("profileFavorites");
            if (favSection) favSection.scrollIntoView({ behavior: "smooth" });
          }, 300);
          this.setActiveNav(link);
          return;
        }

        // Normal hash navigation for home / podcasts
        this.setActiveNav(link);
      });

      // Sync on hash change
      window.addEventListener("hashchange", () => {
        const hash = location.hash.replace("#", "") || "home";
        const link = nav.querySelector(`[data-nav="${hash}"]`);
        if (link) this.setActiveNav(link);
      });
    },

    setActiveNav(activeLink) {
      document.querySelectorAll(".mobile-nav a").forEach((a) => {
        a.classList.toggle("active", a === activeLink);
      });
    },

    bindProfileNav() {
      const navProfile = document.getElementById("navProfile");
      if (!navProfile) return;
      // already handled in bindBottomNav
    },

    observePlayer() {
      const player = document.getElementById("playerBar");
      const audio = document.getElementById("audioPlayer");
      if (!player || !audio) return;

      // Keep body class in sync for padding
      const observer = new MutationObserver(() => {
        const shown = player.classList.contains("show");
        document.body.classList.toggle("player-open", shown);
      });
      observer.observe(player, { attributes: true, attributeFilter: ["class"] });

      // Progress line on mini player
      audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        player.style.setProperty("--player-progress", pct + "%");
      });
    },

    enhanceCards() {
      // Add touch feedback class if needed
      document.addEventListener(
        "touchstart",
        (e) => {
          const card = e.target.closest(".podcast-card, .card, .episode-card");
          if (card) card.classList.add("pressed");
        },
        { passive: true }
      );
      document.addEventListener(
        "touchend",
        (e) => {
          const card = e.target.closest(".podcast-card, .card, .episode-card");
          if (card) card.classList.remove("pressed");
        },
        { passive: true }
      );
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => UI.init());
  } else {
    UI.init();
  }

  window.NightCastUIV2 = UI;
})();
