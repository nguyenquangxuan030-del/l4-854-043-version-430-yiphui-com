
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function initBackTop() {
    var button = document.querySelector('[data-back-top]');

    if (!button) {
      return;
    }

    function update() {
      if (window.scrollY > 420) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');

    if (!root) {
      return;
    }

    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    var scopes = document.querySelectorAll('[data-filter-scope]');

    scopes.forEach(function (scope) {
      var keywordInput = scope.querySelector('[data-filter-input]');
      var categorySelect = scope.querySelector('[data-category-filter]');
      var yearSelect = scope.querySelector('[data-year-filter]');
      var countOutput = scope.querySelector('[data-result-count]');
      var list = document.querySelector('[data-card-list]');
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];
      var params = new URLSearchParams(window.location.search);
      var queryFromUrl = params.get('q') || '';

      if (keywordInput && queryFromUrl) {
        keywordInput.value = queryFromUrl;
      }

      function applyFilter() {
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
        var category = categorySelect ? categorySelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = card.getAttribute('data-search') || '';
          var cardCategory = card.getAttribute('data-category') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var ok = true;

          if (keyword && text.indexOf(keyword) === -1) {
            ok = false;
          }

          if (category && cardCategory !== category) {
            ok = false;
          }

          if (year && cardYear !== year) {
            ok = false;
          }

          card.style.display = ok ? '' : 'none';

          if (ok) {
            visible += 1;
          }
        });

        if (countOutput) {
          countOutput.textContent = visible + ' 部影片';
        }
      }

      if (keywordInput) {
        keywordInput.addEventListener('input', applyFilter);
      }

      if (categorySelect) {
        categorySelect.addEventListener('change', applyFilter);
      }

      if (yearSelect) {
        yearSelect.addEventListener('change', applyFilter);
      }

      applyFilter();
    });
  }

  function initPlayer() {
    var box = document.querySelector('[data-video-url]');

    if (!box) {
      return;
    }

    var video = box.querySelector('video');
    var overlay = box.querySelector('.play-overlay');
    var message = box.querySelector('.player-message');
    var videoUrl = box.getAttribute('data-video-url');
    var initialized = false;

    function setMessage(text) {
      if (message) {
        message.textContent = text || '';
      }
    }

    function attachSource() {
      if (initialized) {
        return Promise.resolve();
      }

      initialized = true;

      if (!videoUrl) {
        setMessage('当前条目未提供可播放地址。');
        return Promise.reject(new Error('Missing video URL'));
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        video.__hls = hls;

        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage('视频已就绪。');
        });

        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setMessage('网络加载异常，正在重新尝试。');
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setMessage('媒体解析异常，正在恢复播放。');
            hls.recoverMediaError();
          } else {
            setMessage('当前浏览器无法继续播放该视频源。');
            hls.destroy();
          }
        });

        return Promise.resolve();
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        setMessage('视频已就绪。');
        return Promise.resolve();
      }

      setMessage('当前浏览器不支持 HLS 播放。');
      return Promise.reject(new Error('HLS is not supported'));
    }

    function playVideo() {
      attachSource()
        .then(function () {
          return video.play();
        })
        .then(function () {
          if (overlay) {
            overlay.hidden = true;
          }
        })
        .catch(function () {
          setMessage('播放未能启动，请稍后重试或更换浏览器。');
        });
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.hidden = true;
      }
    });
  }

  ready(function () {
    initMobileMenu();
    initBackTop();
    initHero();
    initFilters();
    initPlayer();
  });
})();
