/*
 * site.js — single shared script for all pages
 * Contains: social bar, footer
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
      href: "https://www.snapchat.com/@magicmaddox1",
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
      '<a href="/">Home</a>' +
      '<a href="/blog">Blog</a>' +
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
      e.textContent = a.join("") + b + "@" + c + d + f;
    }
  }

  // ========================
  // INIT
  // ========================

  function init() {
    initSocialBar();
    initFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
