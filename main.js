/* ============================================================
   Apollo Spirit — Combined Main JS
   Nav toggle, header scroll, language switch, scroll reveal,
   flip cards, cocktail showcase
   ============================================================ */

(function () {
  "use strict";

  /* --- Age Gate --- */
  var ageGate = document.getElementById("age-gate");
  var ageYes = document.getElementById("age-gate-yes");
  var ageNo = document.getElementById("age-gate-no");
  var ageRejected = document.getElementById("age-gate-rejected");

  if (ageGate) {
    // Check if already verified
    if (localStorage.getItem("apollo_age_verified") === "true") {
      ageGate.classList.add("is-hidden");
      ageGate.style.display = "none";
    } else {
      document.body.classList.add("age-gate-active");

      // Yes — verified
      if (ageYes) {
        ageYes.addEventListener("click", function () {
          localStorage.setItem("apollo_age_verified", "true");
          document.body.classList.remove("age-gate-active");
          ageGate.classList.add("is-hidden");
          setTimeout(function () {
            ageGate.style.display = "none";
          }, 700);
        });
      }

      // No — rejected
      if (ageNo) {
        ageNo.addEventListener("click", function () {
          if (ageRejected) {
            ageRejected.classList.add("is-visible");
          }
        });
      }
    }
  }

  /* --- Navigation Toggle --- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);

      if (!expanded) {
        var firstLink = menu.querySelector(".nav__link");
        if (firstLink) firstLink.focus();
      }
    });

    var navLinks = menu.querySelectorAll(".nav__link");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  /* --- Header Scroll State --- */
  var header = document.querySelector(".site-header");
  var scrollThreshold = 50;
  var ticking = false;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    ticking = false;
  }

  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true },
    );
    updateHeader();
  }

  /* --- Language Switcher --- */
  var langBtns = document.querySelectorAll(".nav__lang-btn");

  for (var j = 0; j < langBtns.length; j++) {
    langBtns[j].addEventListener("click", function () {
      for (var k = 0; k < langBtns.length; k++) {
        langBtns[k].classList.remove("nav__lang-btn--active");
        langBtns[k].setAttribute("aria-pressed", "false");
      }
      this.classList.add("nav__lang-btn--active");
      this.setAttribute("aria-pressed", "true");

      var lang = this.getAttribute("data-lang");
      document.documentElement.setAttribute("lang", lang);
    });
  }

  /* --- Bottle Touch Rotation (mobile) --- */
  var bottleScene = document.querySelector(".bottle-scene");

  if (bottleScene && "ontouchstart" in window) {
    bottleScene.addEventListener("click", function () {
      bottleScene.classList.toggle("is-touched");
    });
  }

  /* --- Flip Cards (Team section) --- */
  var flipCards = document.querySelectorAll(".flip-card");

  flipCards.forEach(function (card) {
    var flipToggle = function () {
      card.classList.toggle("is-flipped");
    };
    card.addEventListener("click", flipToggle);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipToggle();
      }
    });
  });

  /* --- Cocktail Showcase --- */
  var cocktailSection = document.querySelector(".cocktails");
  var allCards = document.querySelectorAll(".cocktail-card");
  var revealBtn = document.querySelector(".cocktails__reveal-btn");
  var revealText = revealBtn
    ? revealBtn.querySelector(".cocktails__reveal-text")
    : null;
  var revealIcon = revealBtn
    ? revealBtn.querySelector(".cocktails__reveal-icon")
    : null;
  var isExpanded = false;

  if (revealBtn && allCards.length > 4) {
    // Hide cards beyond the first 4
    for (var c = 4; c < allCards.length; c++) {
      allCards[c].classList.add("cocktail-card--hidden");
    }

    revealBtn.addEventListener("click", function () {
      isExpanded = !isExpanded;

      for (var c = 4; c < allCards.length; c++) {
        if (isExpanded) {
          allCards[c].classList.remove("cocktail-card--hidden");
          allCards[c].style.transitionDelay = (c - 4) * 0.08 + "s";
        } else {
          allCards[c].classList.add("cocktail-card--hidden");
          allCards[c].style.transitionDelay = "0s";
        }
      }

      if (revealText) {
        revealText.textContent = isExpanded
          ? "Show Less"
          : "Explore All Serves";
      }
      if (revealIcon) {
        revealIcon.style.transform = isExpanded
          ? "rotate(180deg)"
          : "rotate(0deg)";
      }

      revealBtn.setAttribute("aria-expanded", String(isExpanded));

      // Scroll to newly revealed cards if expanding
      if (isExpanded && allCards[4]) {
        setTimeout(function () {
          allCards[4].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 150);
      }
      // Scroll to start
      if (!isExpanded && cocktailSection) {
        setTimeout(function () {
          cocktailSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  }

  /* --- Scroll Reveal (IntersectionObserver) --- */
  var revealElements = document.querySelectorAll(
    ".timeline__item, .pillar, .process__step, .cocktail-card, .sale__bottle, .sale__info, .flip-card",
  );

  if ("IntersectionObserver" in window && revealElements.length) {
    for (var m = 0; m < revealElements.length; m++) {
      revealElements[m].classList.add("reveal");
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var n = 0; n < entries.length; n++) {
          if (entries[n].isIntersecting) {
            entries[n].target.classList.add("is-visible");
            observer.unobserve(entries[n].target);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    for (var p = 0; p < revealElements.length; p++) {
      observer.observe(revealElements[p]);
    }

    // Observe hidden cocktail cards when they become visible
    if (revealBtn) {
      revealBtn.addEventListener("click", function () {
        if (isExpanded) {
          for (var c = 4; c < allCards.length; c++) {
            allCards[c].classList.add("reveal");
            observer.observe(allCards[c]);
          }
        }
      });
    }
  }
})();
