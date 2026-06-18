(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuToggle = document.querySelector(".menu-toggle");
        var mobileNav = document.querySelector(".mobile-nav");

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener("click", function () {
                var opened = mobileNav.classList.toggle("is-open");
                menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
            });
        }

        var carousel = document.querySelector("[data-carousel]");

        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
            var nextButton = carousel.querySelector(".hero-next");
            var prevButton = carousel.querySelector(".hero-prev");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function restart() {
                if (timer) {
                    window.clearInterval(timer);
                }

                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            if (nextButton) {
                nextButton.addEventListener("click", function () {
                    show(current + 1);
                    restart();
                });
            }

            if (prevButton) {
                prevButton.addEventListener("click", function () {
                    show(current - 1);
                    restart();
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    restart();
                });
            });

            show(0);
            restart();
        }

        var localInputs = Array.prototype.slice.call(document.querySelectorAll(".local-filter-input"));

        localInputs.forEach(function (input) {
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-row"));

            input.addEventListener("input", function () {
                var value = input.value.trim().toLowerCase();

                cards.forEach(function (card) {
                    var searchable = (card.getAttribute("data-search") || "").toLowerCase();
                    card.classList.toggle("is-filtered-out", value && searchable.indexOf(value) === -1);
                });
            });
        });

        var params = new URLSearchParams(window.location.search);
        var initialKeyword = params.get("q");

        if (initialKeyword && localInputs.length) {
            localInputs[0].value = initialKeyword;
            localInputs[0].dispatchEvent(new Event("input"));
        }
    });
})();
