(function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (menuToggle && mobilePanel) {
        menuToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('.hero-slide'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let active = 0;
        let timer = null;

        function showSlide(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5600);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(active - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(active + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const filterSelect = document.querySelector('[data-filter-select="year"]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const emptyState = document.querySelector('[data-empty-state]');

    function applyFilters() {
        const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        const year = filterSelect ? filterSelect.value : '';
        let visible = 0;

        cards.forEach(function (card) {
            const text = [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-category')
            ].join(' ').toLowerCase();
            const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            const matchYear = !year || card.getAttribute('data-year') === year;
            const isVisible = matchKeyword && matchYear;
            card.style.display = isVisible ? '' : 'none';
            if (isVisible) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilters);
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', applyFilters);
    }
})();
