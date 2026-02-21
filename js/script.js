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
