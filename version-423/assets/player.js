(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.hls-player'));

  players.forEach(function (video) {
    var box = video.closest('.player-box');
    var cover = box ? box.querySelector('[data-play-cover]') : null;
    var src = video.getAttribute('data-video');
    var attached = false;
    var hls = null;

    var attach = function () {
      if (attached || !src) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }

      attached = true;
    };

    var start = function () {
      attach();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.controls = true;
      var playAction = video.play();
      if (playAction && typeof playAction.catch === 'function') {
        playAction.catch(function () {
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }
    };

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!attached) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });

    video.addEventListener('error', function () {
      if (hls && hls.recoverMediaError) {
        hls.recoverMediaError();
      }
    });
  });
})();
