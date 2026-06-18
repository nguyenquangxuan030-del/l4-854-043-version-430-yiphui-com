(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var active = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    showSlide(0);
    startTimer();
  }

  var filterInput = document.querySelector("[data-filter-input]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var categoryFilter = document.querySelector("[data-category-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
  var emptyState = document.querySelector("[data-empty-state]");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyQueryFromUrl() {
    if (!filterInput || !filterInput.hasAttribute("data-site-search")) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    filterInput.value = query;
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = normalize(filterInput ? filterInput.value : "");
    var year = yearFilter ? yearFilter.value : "";
    var category = categoryFilter ? categoryFilter.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var cardYear = card.getAttribute("data-year") || "";
      var cardCategory = card.getAttribute("data-category") || "";
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      if (category && cardCategory !== category) {
        matched = false;
      }

      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  applyQueryFromUrl();

  if (filterInput) {
    filterInput.addEventListener("input", filterCards);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", filterCards);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterCards);
  }

  filterCards();
})();
