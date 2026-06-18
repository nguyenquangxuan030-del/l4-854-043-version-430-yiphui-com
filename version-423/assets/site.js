(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var scrollTop = document.querySelector('[data-scroll-top]');

  if (scrollTop) {
    window.addEventListener('scroll', function () {
      scrollTop.classList.toggle('is-visible', window.scrollY > 420);
    });

    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var backgrounds = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-bg]'));
    var copies = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-copy]'));
    var thumbs = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-thumb]'));
    var active = 0;
    var timer = null;

    var showSlide = function (index) {
      active = (index + copies.length) % copies.length;
      backgrounds.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === active);
      });
      copies.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === active);
      });
      thumbs.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === active);
      });
    };

    var startTimer = function () {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(active + 1);
      }, 5600);
    };

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    startTimer();
  }

  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid]'));

  grids.forEach(function (grid) {
    var scope = grid.closest('section') || document;
    var input = scope.querySelector('[data-filter-input]');
    var year = scope.querySelector('[data-filter-year]');
    var empty = scope.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));

    var applyFilter = function () {
      var q = input ? input.value.trim().toLowerCase() : '';
      var y = year ? year.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.category, card.dataset.year].join(' ').toLowerCase();
        var ok = (!q || text.indexOf(q) !== -1) && (!y || (card.dataset.year || '').indexOf(y) !== -1);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (year) {
      year.addEventListener('change', applyFilter);
    }
  });

  var results = document.getElementById('search-results');

  if (results) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = document.querySelector('[data-search-page-input]');
    var summary = document.querySelector('[data-search-summary]');
    var empty = document.getElementById('search-empty');

    if (input) {
      input.value = query;
    }

    fetch('assets/movies.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (movies) {
        var keyword = query.trim().toLowerCase();
        var matched = movies.filter(function (movie) {
          if (!keyword) {
            return true;
          }
          return [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' ')].join(' ').toLowerCase().indexOf(keyword) !== -1;
        }).slice(0, 120);

        if (summary) {
          summary.textContent = keyword ? '与“' + query + '”相关的影片如下。' : '可直接浏览近期收录的精选影片。';
        }

        results.innerHTML = matched.map(function (movie) {
          return '<article class="movie-card" data-card>' +
            '<a class="poster-link" href="' + movie.url + '">' +
            '<img class="poster-img" src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="poster-badge">' + escapeHtml(movie.type) + '</span>' +
            '</a>' +
            '<div class="movie-card-body">' +
            '<div class="movie-meta-line">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.year) + '</div>' +
            '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>' +
            '<p>' + escapeHtml(movie.one_line) + '</p>' +
            '<div class="card-foot"><span>★ ' + movie.rating + '</span><span>' + movie.views_text + '热度</span></div>' +
            '</div>' +
            '</article>';
        }).join('');

        if (empty) {
          empty.classList.toggle('is-visible', matched.length === 0);
        }
      });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (item) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[item];
    });
  }
})();
