/*
 * site.js — single shared script for all pages
 * Contains: social bar, footer, waitlist popup
 * Add new site-wide features here instead of creating new script files.
 */
(function () {
  // ========================
  // SOCIAL BAR + FOOTER
  // ========================

  var socials = [
    {
      href: "https://www.tiktok.com/@magicmaddox",
      icon: "fab fa-tiktok",
      label: "TikTok",
    },
    {
      href: "https://www.instagram.com/magicmaddox1/reels/",
      icon: "fab fa-instagram",
      label: "Instagram",
    },
    {
      href: "https://www.youtube.com/@maddoxschmidlkofer",
      icon: "fab fa-youtube",
      label: "YouTube",
    },
    {
      href: "https://www.snapchat.com/@magicmaddox",
      icon: "fab fa-snapchat-ghost",
      label: "Snapchat",
    },
    {
      href: "https://www.linkedin.com/in/maddox-schmidlkofer/",
      icon: "fab fa-linkedin",
      label: "LinkedIn",
    },
    { href: "https://x.com/_maddox1337", icon: "fab fa-twitter", label: "X" },
    {
      href: "https://github.com/maddox05",
      icon: "fab fa-github",
      label: "GitHub",
    },
  ];

  function initSocialBar() {
    var header = document.querySelector("header");
    if (!header) return;

    var bar = document.createElement("div");
    bar.className = "social-bar";

    var iconsHtml = socials
      .map(function (s) {
        return (
          '<a href="' +
          s.href +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          s.label +
          '" title="' +
          s.label +
          '">' +
          '<i class="' +
          s.icon +
          '"></i>' +
          "</a>"
        );
      })
      .join("");

    bar.innerHTML =
      '<div class="social-icons">' +
      iconsHtml +
      "</div>" +
      '<a href="/contact" class="social-cta">Get In Touch <i class="fas fa-arrow-right"></i></a>';

    header.parentNode.insertBefore(bar, header.nextSibling);
  }

  function initFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;

    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="footer-links">' +
      '<a href="/privacy">Privacy Policy</a>' +
      '<a href="/terms">Terms of Service</a>' +
      '<a href="/contact">Contact</a>' +
      "</div>" +
      '<p class="footer-email"><span id="eml"></span></p>' +
      "<p>&copy; " +
      new Date().getFullYear() +
      " Maddox Schmidlkofer. All rights reserved.</p>";

    var e = document.getElementById("eml");
    if (e) {
      var a = ["m", "a", "d", "d", "o", "x"],
        b = "public",
        c = "gm",
        d = "ail",
        f = ".com";
      e.textContent = a.join("") + b + "\u0040" + c + d + f;
    }
  }

  // ========================
  // WAITLIST POPUP
  // ========================

  var STORAGE_KEY_DISMISSED = "waitlist_dismissed";
  var STORAGE_KEY_SIGNED_UP = "waitlist_signed_up";
  var POPUP_DELAY_MS = 500;

  var SUPABASE_URL = "https://gamyfxdqtfkqrytagdod.supabase.co";
  var SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbXlmeGRxdGZrcXJ5dGFnZG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzkyMzMsImV4cCI6MjA5MjM1NTIzM30.Zv1EWvH3Piphqb4ob2o3eGMz5-XRrieu6MFcudKq_0Y";

  function injectWaitlistStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".waitlist-overlay {" +
      "  position: fixed; top: 0; left: 0; width: 100%; height: 100%;" +
      "  background: rgba(0,0,0,0.85); z-index: 10000;" +
      "  display: flex; align-items: center; justify-content: center;" +
      "  opacity: 0; transition: opacity 0.3s ease;" +
      "  pointer-events: none;" +
      "}" +
      ".waitlist-overlay.active {" +
      "  opacity: 1; pointer-events: auto;" +
      "}" +
      ".waitlist-popup {" +
      "  background: var(--primary); border: 4px solid var(--text);" +
      "  box-shadow: 12px 12px 0 var(--text); padding: 2.5rem;" +
      "  max-width: 480px; width: 90vw; position: relative;" +
      "  transform: translateY(20px) scale(0.95);" +
      "  transition: transform 0.3s ease;" +
      "  font-family: 'Courier New', monospace;" +
      "}" +
      ".waitlist-overlay.active .waitlist-popup {" +
      "  transform: translateY(0) scale(1);" +
      "}" +
      ".waitlist-close {" +
      "  position: absolute; top: 0.75rem; right: 0.75rem;" +
      "  background: var(--tertiary); color: white; border: 3px solid var(--text);" +
      "  width: 36px; height: 36px; font-size: 1.2rem; font-weight: bold;" +
      "  cursor: pointer; display: flex; align-items: center; justify-content: center;" +
      "  font-family: 'Courier New', monospace; transition: all 0.2s ease; padding: 0;" +
      "}" +
      ".waitlist-close:hover {" +
      "  background: var(--text); transform: translate(-2px, -2px);" +
      "  box-shadow: 3px 3px 0 var(--text);" +
      "}" +
      ".waitlist-popup h2 {" +
      "  font-size: 1.6rem; text-transform: uppercase; font-weight: 900;" +
      "  color: var(--text); margin: 0 0 1rem 0; line-height: 1.1;" +
      "  border-left: 6px solid var(--tertiary); padding-left: 0.75rem;" +
      "  letter-spacing: -0.5px;" +
      "}" +
      ".waitlist-popup p {" +
      "  color: var(--text); font-size: 0.95rem; line-height: 1.5;" +
      "  margin: 0 0 1.5rem 0;" +
      "}" +
      ".waitlist-form {" +
      "  display: flex; gap: 0;" +
      "}" +
      ".waitlist-input {" +
      "  flex: 1; padding: 0.8rem 1rem; font-family: 'Courier New', monospace;" +
      "  font-size: 1rem; border: 3px solid var(--text); border-right: none;" +
      "  background: var(--bg); color: var(--text); outline: none;" +
      "  transition: all 0.2s ease;" +
      "}" +
      ".waitlist-input:focus {" +
      "  background: white;" +
      "}" +
      ".waitlist-input::placeholder {" +
      "  color: #999; text-transform: uppercase; font-size: 0.8rem;" +
      "  letter-spacing: 0.5px;" +
      "}" +
      ".waitlist-submit {" +
      "  background: var(--secondary); color: white; border: 3px solid var(--text);" +
      "  padding: 0.8rem 1.5rem; font-family: 'Courier New', monospace;" +
      "  font-weight: bold; text-transform: uppercase; font-size: 0.85rem;" +
      "  cursor: pointer; transition: all 0.2s ease; white-space: nowrap;" +
      "  letter-spacing: 0.5px;" +
      "}" +
      ".waitlist-submit:hover {" +
      "  background: var(--accent); transform: translate(-2px, -2px);" +
      "  box-shadow: 4px 4px 0 var(--text);" +
      "}" +
      ".waitlist-error {" +
      "  color: var(--tertiary); font-size: 0.8rem; font-weight: bold;" +
      "  text-transform: uppercase; margin-top: 0.5rem; display: none;" +
      "}" +
      ".waitlist-success {" +
      "  text-align: center; padding: 1rem 0;" +
      "}" +
      ".waitlist-success h3 {" +
      "  font-size: 1.3rem; text-transform: uppercase; color: var(--text);" +
      "  margin: 0 0 0.5rem 0; font-weight: 900;" +
      "}" +
      ".waitlist-success p {" +
      "  margin: 0; font-size: 0.9rem;" +
      "}" +
      ".waitlist-cta-btn {" +
      "  display: inline-flex; align-items: center; gap: 0.5rem;" +
      "  background: var(--accent); color: white; padding: 0.6rem 1.2rem;" +
      "  text-decoration: none; font-weight: bold; text-transform: uppercase;" +
      "  font-size: 0.85rem; letter-spacing: 1px; border: 3px solid var(--text);" +
      "  transition: all 0.2s ease; white-space: nowrap; cursor: pointer;" +
      "  font-family: 'Courier New', monospace;" +
      "}" +
      ".waitlist-cta-btn:hover {" +
      "  background: var(--primary); color: var(--text);" +
      "  transform: translate(-2px, -2px); box-shadow: 4px 4px 0 var(--text);" +
      "}" +
      "@media (max-width: 768px) {" +
      "  .waitlist-popup { padding: 1.5rem; box-shadow: 6px 6px 0 var(--text); }" +
      "  .waitlist-popup h2 { font-size: 1.3rem; }" +
      "  .waitlist-form { flex-direction: column; }" +
      "  .waitlist-input { border-right: 3px solid var(--text); border-bottom: none; }" +
      "  .waitlist-submit { width: 100%; text-align: center; justify-content: center; }" +
      "}";
    document.head.appendChild(style);
  }

  function createWaitlistOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "waitlist-overlay";
    overlay.id = "waitlist-overlay";

    overlay.innerHTML =
      '<div class="waitlist-popup">' +
      '  <button class="waitlist-close" id="waitlist-close">&times;</button>' +
      "  <h2>Know What You're Really Eating</h2>" +
      "  <p>We're building something to help you find clean restaurants " +
      "and uncover what's actually in your food, air, & water beyond the label. Stay in the loop.</p>" +
      '  <div id="waitlist-form-area">' +
      '    <div class="waitlist-form">' +
      '      <input type="email" class="waitlist-input" id="waitlist-email" placeholder="your email" />' +
      '      <button class="waitlist-submit" id="waitlist-submit">Join Waitlist</button>' +
      "    </div>" +
      '    <div class="waitlist-error" id="waitlist-error">Enter a valid email</div>' +
      "  </div>" +
      "</div>";

    document.body.appendChild(overlay);

    document
      .getElementById("waitlist-close")
      .addEventListener("click", function () {
        hideWaitlistPopup();
        try {
          localStorage.setItem(STORAGE_KEY_DISMISSED, "true");
        } catch (e) {}
      });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        hideWaitlistPopup();
        try {
          localStorage.setItem(STORAGE_KEY_DISMISSED, "true");
        } catch (e) {}
      }
    });

    document
      .getElementById("waitlist-submit")
      .addEventListener("click", handleWaitlistSubmit);
    document
      .getElementById("waitlist-email")
      .addEventListener("keydown", function (e) {
        if (e.key === "Enter") handleWaitlistSubmit();
      });
  }

  function handleWaitlistSubmit() {
    var input = document.getElementById("waitlist-email");
    var error = document.getElementById("waitlist-error");
    var submitBtn = document.getElementById("waitlist-submit");
    var email = input.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.style.display = "block";
      input.focus();
      return;
    }

    error.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.textContent = "...";

    var sb =
      typeof supabase !== "undefined"
        ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : null;

    if (sb) {
      sb.from("waitlist_emails")
        .insert({ email: email })
        .then(function (res) {
          if (!res.error || res.error.code === "23505") {
            try {
              localStorage.setItem(STORAGE_KEY_SIGNED_UP, "true");
            } catch (e) {}
            showSuccess();
          } else {
            error.textContent = "Something went wrong. Try again.";
            error.style.display = "block";
            submitBtn.disabled = false;
            submitBtn.textContent = "Join Waitlist";
          }
        });
    } else {
      try {
        localStorage.setItem(STORAGE_KEY_SIGNED_UP, "true");
      } catch (e) {}
      showSuccess();
    }

    function showSuccess() {
      var formArea = document.getElementById("waitlist-form-area");
      formArea.innerHTML =
        '<div class="waitlist-success">' +
        "  <h3>You're in.</h3>" +
        "  <p>We'll let you know when it's ready.</p>" +
        "</div>";
      setTimeout(function () {
        hideWaitlistPopup();
      }, 2500);
    }
  }

  function showWaitlistPopup() {
    var overlay = document.getElementById("waitlist-overlay");
    if (!overlay) return;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function hideWaitlistPopup() {
    var overlay = document.getElementById("waitlist-overlay");
    if (!overlay) return;
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function resetWaitlistForm() {
    var formArea = document.getElementById("waitlist-form-area");
    if (formArea) {
      formArea.innerHTML =
        '<div class="waitlist-form">' +
        '  <input type="email" class="waitlist-input" id="waitlist-email" placeholder="your email" />' +
        '  <button class="waitlist-submit" id="waitlist-submit">Join Waitlist</button>' +
        "</div>" +
        '<div class="waitlist-error" id="waitlist-error">Enter a valid email</div>';
      document
        .getElementById("waitlist-submit")
        .addEventListener("click", handleWaitlistSubmit);
      document
        .getElementById("waitlist-email")
        .addEventListener("keydown", function (e) {
          if (e.key === "Enter") handleWaitlistSubmit();
        });
    }
  }

  function injectWaitlistCTA() {
    var bar = document.querySelector(".social-bar");
    if (!bar) return;

    var signedUp = false;
    try {
      signedUp = localStorage.getItem(STORAGE_KEY_SIGNED_UP) === "true";
    } catch (e) {}
    if (signedUp) return;

    var cta = document.createElement("button");
    cta.className = "waitlist-cta-btn";
    cta.innerHTML = '<i class="fas fa-flask"></i> Join Waitlist';
    cta.addEventListener("click", function () {
      resetWaitlistForm();
      showWaitlistPopup();
    });

    var existingCta = bar.querySelector(".social-cta");
    if (existingCta) {
      var ctaWrap = document.createElement("div");
      ctaWrap.style.cssText =
        "display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;";
      existingCta.parentNode.insertBefore(ctaWrap, existingCta);
      ctaWrap.appendChild(cta);
      ctaWrap.appendChild(existingCta);
    } else {
      bar.appendChild(cta);
    }
  }

  // ========================
  // INIT
  // ========================

  function init() {
    initSocialBar();
    initFooter();

    var isHome =
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html" ||
      window.location.pathname === "";

    if (isHome) {
      injectWaitlistStyles();
      createWaitlistOverlay();
      injectWaitlistCTA();

      var dismissed = false;
      var signedUp = false;
      try {
        dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED) === "true";
        signedUp = localStorage.getItem(STORAGE_KEY_SIGNED_UP) === "true";
      } catch (e) {}

      if (!dismissed && !signedUp) {
        setTimeout(function () {
          showWaitlistPopup();
          try {
            localStorage.setItem(STORAGE_KEY_DISMISSED, "true");
          } catch (e) {}
        }, POPUP_DELAY_MS);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
