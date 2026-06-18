(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.getElementById('mobileNav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('.hero-control.prev');
    var next = document.querySelector('.hero-control.next');
    var heroIndex = 0;
    var heroTimer = null;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, pos) {
            slide.classList.toggle('active', pos === heroIndex);
        });
        dots.forEach(function (dot, pos) {
            dot.classList.toggle('active', pos === heroIndex);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            showHero(heroIndex + 1);
        }, 5600);
    }

    if (prev) {
        prev.addEventListener('click', function () {
            showHero(heroIndex - 1);
            startHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showHero(heroIndex + 1);
            startHero();
        });
    }

    dots.forEach(function (dot, pos) {
        dot.addEventListener('click', function () {
            showHero(pos);
            startHero();
        });
    });

    startHero();

    var filterInput = document.querySelector('.js-filter-input');
    var filterSelects = Array.prototype.slice.call(document.querySelectorAll('.js-filter-select'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid] .movie-card'));

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var keyword = normalize(filterInput ? filterInput.value : '');
        var filters = {};
        filterSelects.forEach(function (select) {
            filters[select.getAttribute('data-filter')] = normalize(select.value);
        });
        cards.forEach(function (card) {
            var text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.genre + ' ' + card.dataset.type + ' ' + card.dataset.year + ' ' + card.dataset.region);
            var matched = !keyword || text.indexOf(keyword) !== -1;
            Object.keys(filters).forEach(function (key) {
                if (filters[key] && normalize(card.dataset[key]) !== filters[key]) {
                    matched = false;
                }
            });
            card.hidden = !matched;
        });
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query) {
            filterInput.value = query;
        }
        filterInput.addEventListener('input', applyFilters);
    }

    filterSelects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
    });

    applyFilters();

    var topButton = document.querySelector('.back-top');
    if (topButton) {
        window.addEventListener('scroll', function () {
            topButton.classList.toggle('show', window.scrollY > 480);
        }, { passive: true });
        topButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}());
