(function () {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    const movies = window.SITE_MOVIES || [];

    if (input) {
        input.value = query;
        input.addEventListener('input', function () {
            render(input.value.trim());
        });
    }

    function matchMovie(movie, keyword) {
        if (!keyword) {
            return true;
        }
        const text = [
            movie.title,
            movie.year,
            movie.region,
            movie.type,
            movie.genre,
            movie.category,
            movie.summary
        ].join(' ').toLowerCase();
        return text.indexOf(keyword.toLowerCase()) !== -1;
    }

    function cardTemplate(movie) {
        return [
            '<article class="movie-card compact">',
            '<a class="poster" href="' + movie.url + '">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="play-badge">▶</span>',
            '</a>',
            '<div class="movie-info">',
            '<div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
            '<p>' + escapeHtml(movie.summary) + '</p>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function render(keyword) {
        if (!results) {
            return;
        }

        const matched = movies.filter(function (movie) {
            return matchMovie(movie, keyword);
        }).slice(0, 120);

        if (!matched.length) {
            results.innerHTML = '<p class="search-empty">未找到匹配内容</p>';
            return;
        }

        results.innerHTML = matched.map(cardTemplate).join('');
    }

    render(query);
})();
