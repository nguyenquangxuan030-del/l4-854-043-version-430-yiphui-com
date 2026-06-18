(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function uniqueValues(cards, key) {
        var values = [];
        cards.forEach(function (card) {
            var value = card.getAttribute(key) || "";
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        return values.sort(function (a, b) {
            return b.localeCompare(a, "zh-Hans-CN");
        });
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function initMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector(".hero-slider");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function setSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                setSlide(index);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        setSlide(0);
        start();
    }

    function initFilters() {
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var panel = document.querySelector(".filter-panel");
        if (!cards.length || !panel) {
            return;
        }
        var input = panel.querySelector(".filter-input");
        var year = panel.querySelector(".filter-year");
        var region = panel.querySelector(".filter-region");
        var type = panel.querySelector(".filter-type");
        var empty = document.querySelector(".empty-state");

        fillSelect(year, uniqueValues(cards, "data-year"));
        fillSelect(region, uniqueValues(cards, "data-region"));
        fillSelect(type, uniqueValues(cards, "data-type"));

        function apply() {
            var query = normalize(input && input.value);
            var y = year ? year.value : "";
            var r = region ? region.value : "";
            var t = type ? type.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var ok = true;
                if (query && text.indexOf(query) === -1) {
                    ok = false;
                }
                if (y && card.getAttribute("data-year") !== y) {
                    ok = false;
                }
                if (r && card.getAttribute("data-region") !== r) {
                    ok = false;
                }
                if (t && card.getAttribute("data-type") !== t) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, year, region, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && input) {
            input.value = q;
        }
        apply();
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
