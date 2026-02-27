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

// ===== Contact form validation & submission =====
(function () {
  var form = document.getElementById("contactForm");
  var formSuccess = document.getElementById("formSuccess");
  if (!form || !formSuccess) return;

  // ── 1. RULES ─────────────────────────────────────────────────────
  // Each rule defines: which field id to check, a test function,
  // and the error message to show if the test fails.
  var rules = [
    {
      id: "firstName",
      test: (v) => /^[a-zA-Z\s\-']{2,50}$/.test(v.trim()),
      message: "First name must be 2-50 characters (letters only).",
    },
    {
      id: "lastName",
      test: (v) => /^[a-zA-Z\s\-']{2,50}$/.test(v.trim()),
      message: "Last name must be 2-50 characters (letters only).",
    },
    {
      id: "workEmail",
      test: (v) => {
        const email = v.trim();
        // Accept only business emails (exclude common free providers)
        const businessEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const freeProviders = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "aol.com",
          "icloud.com",
          "protonmail.com",
          "zoho.com",
          "mail.com",
          "gmx.com",
        ];
        if (!businessEmailPattern.test(email)) return false;
        const domain = email.split("@")[1]?.toLowerCase();
        if (!domain) return false;
        return !freeProviders.includes(domain);
      },
      message:
        "Please enter your business/work email address (personal emails like Gmail, Yahoo, etc. are not accepted).",
    },
    {
      id: "company",
      test: (v) => v.trim().length >= 2 && v.trim().length <= 100,
      message: "Company name must be between 2 and 100 characters.",
    },
    {
      id: "role",
      test: (v) => v.trim().length >= 2,
      message: "Please specify your role in the company.",
    },
    {
      id: "stage",
      test: (v) => v !== "" && v !== null,
      message: "Please select your current stage of business.",
    },
    {
      id: "solve", // Assuming this is the name/class of your checkbox group
      test: function () {
        const checked = document.querySelectorAll(
          'input[name="solve"]:checked',
        );
        return checked.length > 0;
      },
      message: "Please select at least one thing you are looking to solve.",
    },
    {
      id: "message",
      test: (v) => v.trim().length >= 10,
      message: "Please provide a bit more detail (at least 10 characters).",
    },
  ];

  // ── 2. HELPERS ────────────────────────────────────────────────────

  // Show an error message below a field
  function showError(field, message) {
    field.classList.add("input-error");

    // Avoid duplicating the error element
    var existing = field.parentNode.querySelector(".field-error");
    if (existing) {
      existing.textContent = message;
      return;
    }

    var err = document.createElement("span");
    err.className = "field-error";
    err.setAttribute("role", "alert");
    err.textContent = message;
    field.parentNode.appendChild(err);
  }

  // Clear the error on a field
  function clearError(field) {
    field.classList.remove("input-error");
    var err = field.parentNode.querySelector(".field-error");
    if (err) err.remove();
  }

  // Validate a single rule — returns true if valid
  function validateRule(rule) {
    var field = document.getElementById(rule.id);
    if (!field) return true; // field doesn't exist on this page, skip
    var value = field.value;
    if (rule.test(value)) {
      clearError(field);
      return true;
    } else {
      showError(field, rule.message);
      return false;
    }
  }

  // ── 3. LIVE VALIDATION (on blur) ─────────────────────────────────
  // Validate each field the moment the user leaves it,
  // so they get feedback before hitting submit.
  rules.forEach(function (rule) {
    var field = document.getElementById(rule.id);
    if (!field) return;

    field.addEventListener("blur", function () {
      validateRule(rule);
    });

    // Also clear the error as soon as the user starts correcting
    field.addEventListener("input", function () {
      if (field.classList.contains("input-error")) {
        validateRule(rule);
      }
    });
  });

  // ── 4. CHECKBOX VALIDATION ────────────────────────────────────────
  // At least one "solve" checkbox must be checked.
  function validateCheckboxes() {
    var checked = form.querySelectorAll("input[name='solve']:checked");
    var group = form.querySelector(".checkbox-grid");
    var existing = group && group.parentNode.querySelector(".field-error");

    if (checked.length > 0) {
      if (existing) existing.remove();
      return true;
    } else {
      if (!existing && group) {
        var err = document.createElement("span");
        err.className = "field-error";
        err.setAttribute("role", "alert");
        err.textContent = "Please select at least one area you need help with.";
        group.parentNode.appendChild(err);
      }
      return false;
    }
  }

  // Clear checkbox error as soon as one is ticked
  form.querySelectorAll("input[name='solve']").forEach(function (cb) {
    cb.addEventListener("change", validateCheckboxes);
  });

  // ── 5. SUBMIT ─────────────────────────────────────────────────────
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Run all rules and collect results
    var allValid = rules.every(function (rule) {
      return validateRule(rule);
    });

    // Run checkbox check separately
    var checkboxValid = validateCheckboxes();

    if (!allValid || !checkboxValid) {
      // Scroll to the first error so the user sees it
      var firstError = form.querySelector(".input-error, .field-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return; // stop — do not show success
    }

    // All valid — collect payload and send to Google Sheets
    var payload = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      workEmail: document.getElementById("workEmail").value.trim(),
      company: document.getElementById("company").value.trim(),
      role: document.getElementById("role").value.trim(),
      stage: document.getElementById("stage").value,
      solve: Array.from(form.querySelectorAll("input[name='solve']:checked"))
        .map(function (cb) {
          return cb.value;
        })
        .join(", "),
      message: document.getElementById("message").value.trim(),
    };

    submitToServer(payload, form, formSuccess);
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

// ===== Contact form: Server submission =====
function submitToServer(payload, form, formSuccess) {
  var submitBtn = form.querySelector(".form-submit");
  var originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  // Apps Script requires no Content-Type header to avoid CORS preflight failure
  fetch(
    "https://script.google.com/macros/s/AKfycbxwq8dzLifxwdi74n9g0Gx6B-ncOWfdCyJw5kHD86WjPywNt82LUC_uSIn205oIXzgjOQ/exec",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  )
    .then(function (res) {
      // Apps Script always returns 200 even on redirect — parse text first
      return res.text();
    })
    .then(function (text) {
      var data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { success: false };
      }
      if (data.success) {
        form.style.display = "none";
        formSuccess.classList.add("visible");
      } else {
        showServerError(
          form,
          data.error || "Something went wrong. Please try again.",
        );
        resetSubmitBtn(submitBtn, originalText);
      }
    })
    .catch(function () {
      showServerError(
        form,
        "Could not reach the server. Check your connection.",
      );
      resetSubmitBtn(submitBtn, originalText);
    });
}

function resetSubmitBtn(btn, label) {
  btn.disabled = false;
  btn.textContent = label || "Start the Conversation";
}

function showServerError(form, message) {
  var existing = form.querySelector(".server-error");
  if (existing) {
    existing.textContent = message;
    return;
  }
  var err = document.createElement("p");
  err.className = "server-error field-error";
  err.textContent = message;
  form.appendChild(err);
}
