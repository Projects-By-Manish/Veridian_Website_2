// ===== Mobile menu toggle =====
(function () {
  var toggle = document.querySelector(".mobile-toggle");
  var menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  var menuIcon = toggle.querySelector(".menu-icon");
  var closeIcon = toggle.querySelector(".close-icon");

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    menuIcon.style.display = isOpen ? "none" : "block";
    closeIcon.style.display = isOpen ? "block" : "none";
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      menuIcon.style.display = "block";
      closeIcon.style.display = "none";
    });
  });
})();

// ===== Intersection Observer scroll animations =====
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
    .querySelectorAll(
      ".fade-in, .fade-in-left, .fade-in-right, .anim-fade-left, .anim-fade-right",
    )
    .forEach(function (el) {
      observer.observe(el);
    });
})();

// ===== Handle mailto links =====
function handleMailto(e, email) {
  e.preventDefault();
  var mailtoUrl = "mailto:" + email;
  var webmailUrl = "https://mail.google.com/mail/?view=cm&to=" + email;
  var start = Date.now();
  window.location = mailtoUrl;
  setTimeout(function () {
    if (Date.now() - start < 500) {
      window.open(webmailUrl, "_blank");
    }
  }, 250);
}

// ===== Contact form submission =====
(function () {
  var form = document.getElementById("contactForm");
  var formSuccess = document.getElementById("formSuccess");
  if (!form || !formSuccess) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.style.display = "none";
    formSuccess.classList.add("visible");
  });
})();

// ===== About Page: Image Slider =====
(function () {
  var track = document.getElementById("sliderTrack");
  var dotsContainer = document.getElementById("sliderDots");
  var prevBtn = document.getElementById("sliderPrev");
  var nextBtn = document.getElementById("sliderNext");

  if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

  var slides = Array.from(track.querySelectorAll(".slide-card"));
  var current = 0;
  var perView = 1;

  function getPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function totalPages() {
    return Math.ceil(slides.length / perView);
  }

  function buildDots() {
    dotsContainer.innerHTML = "";
    var pages = totalPages();
    for (var i = 0; i < pages; i++) {
      var btn = document.createElement("button");
      btn.className = "slider-dot" + (i === current ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", "Go to slide group " + (i + 1));
      btn.setAttribute("aria-selected", i === current ? "true" : "false");
      (function (idx) {
        btn.addEventListener("click", function () {
          goTo(idx);
        });
      })(i);
      dotsContainer.appendChild(btn);
    }
  }

  function updateDots() {
    var dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
      d.setAttribute("aria-selected", i === current ? "true" : "false");
    });
  }

  function goTo(idx) {
    var pages = totalPages();
    current = Math.max(0, Math.min(idx, pages - 1));
    var gap = 20; // 1.25rem gap
    var slideWidth = slides[0].offsetWidth + gap;
    track.style.transform =
      "translateX(-" + current * perView * slideWidth + "px)";
    updateDots();
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= pages - 1;
  }

  function init() {
    perView = getPerView();
    current = 0;
    buildDots();
    goTo(0);
  }

  prevBtn.addEventListener("click", function () {
    goTo(current - 1);
  });
  nextBtn.addEventListener("click", function () {
    goTo(current + 1);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  var touchStartX = 0;
  track.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    },
    { passive: true },
  );

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newPer = getPerView();
      if (newPer !== perView) init();
      else goTo(current);
    }, 150);
  });

  init();
})();
