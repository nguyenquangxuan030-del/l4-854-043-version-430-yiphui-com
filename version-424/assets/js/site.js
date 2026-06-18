(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = form.getAttribute("action") || "search.html";
        window.location.href = target + (query ? "?q=" + encodeURIComponent(query) : "");
      });
    });

    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var images = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-bg]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === index);
        });
        images.forEach(function (image, itemIndex) {
          image.classList.toggle("is-active", itemIndex === index);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === index);
        });
      }

      function start() {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function restart() {
        window.clearInterval(timer);
        start();
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          restart();
        });
      });

      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-card-filter]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var empty = scope.querySelector("[data-empty-state]");

      function applyFilter() {
        var query = normalize(input ? input.value : "");
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-category")
          ].join(" "));
          var matched = !query || haystack.indexOf(query) !== -1;
          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
        applyFilter();
      }
    });

    var searchPage = document.querySelector("[data-search-page]");
    if (searchPage) {
      var queryInput = searchPage.querySelector("[data-search-input]");
      var categorySelect = searchPage.querySelector("[data-category-filter]");
      var yearSelect = searchPage.querySelector("[data-year-filter]");
      var searchCards = Array.prototype.slice.call(searchPage.querySelectorAll("[data-movie-card]"));
      var searchEmpty = searchPage.querySelector("[data-empty-state]");
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";

      if (queryInput) {
        queryInput.value = query;
      }

      function applySearch() {
        var keyword = normalize(queryInput ? queryInput.value : "");
        var category = normalize(categorySelect ? categorySelect.value : "");
        var year = normalize(yearSelect ? yearSelect.value : "");
        var visible = 0;

        searchCards.forEach(function (card) {
          var text = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-category")
          ].join(" "));
          var cardCategory = normalize(card.getAttribute("data-category"));
          var cardYear = normalize(card.getAttribute("data-year"));
          var matched = (!keyword || text.indexOf(keyword) !== -1) &&
            (!category || cardCategory === category) &&
            (!year || cardYear === year);
          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });

        if (searchEmpty) {
          searchEmpty.classList.toggle("is-visible", visible === 0);
        }
      }

      [queryInput, categorySelect, yearSelect].forEach(function (element) {
        if (element) {
          element.addEventListener("input", applySearch);
          element.addEventListener("change", applySearch);
        }
      });

      applySearch();
    }
  });
})();
