// Mobile menu toggle
(function () {
  var toggle = document.querySelector(".mobile-toggle");
  var menu = document.getElementById("mobile-menu");
  var menuIcon = toggle.querySelector(".menu-icon");
  var closeIcon = toggle.querySelector(".close-icon");

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    menuIcon.style.display = isOpen ? "none" : "block";
    closeIcon.style.display = isOpen ? "block" : "none";
  });

  // Close on link click
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      menuIcon.style.display = "block";
      closeIcon.style.display = "none";
    });
  });
})();

// Intersection Observer for scroll animations
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "-60px" },
  );

  document
    .querySelectorAll(".fade-in, .fade-in-left, .fade-in-right")
    .forEach(function (el) {
      observer.observe(el);
    });
})();
// Handle mailto links with fallback to webmail
function handleMailto(e, email) {
  e.preventDefault();

  const mailtoUrl = `mailto:${email}`;
  const webmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}`;

  // Try opening mailto
  const start = Date.now();
  window.location = mailtoUrl;

  // If nothing happened after ~500ms, assume no mail app → open Gmail
  setTimeout(() => {
    if (Date.now() - start < 500) {
      window.open(webmailUrl, "_blank");
    }
  }, 250);
}
// Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.textContent = isOpen ? "✕" : "☰";
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
function closeMobile() {
  mobileMenu.classList.remove("open");
  hamburger.textContent = "☰";
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open menu");
}

// Smooth scroll animations
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(".anim-fade-left, .anim-fade-right")
    .forEach((el) => {
      observer.observe(el);
    });
} else {
  document
    .querySelectorAll(".anim-fade-left, .anim-fade-right")
    .forEach((el) => {
      el.classList.add("visible");
    });
}

// Form submission
const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Here you would normally send data to a backend or form service
  // For now we show the success state
  form.style.display = "none";
  formSuccess.classList.add("visible");
});

// Contact form submission (contact.html)
(function () {
  var form = document.getElementById("contactForm");
  var formSuccess = document.getElementById("formSuccess");
  if (form && formSuccess) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      formSuccess.classList.add("visible");
    });
  }
})();
