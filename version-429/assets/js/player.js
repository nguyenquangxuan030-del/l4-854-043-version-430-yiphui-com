(function () {
  function setup(options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var overlay = document.getElementById(options.overlayId);
    var streamUrl = options.source;
    var hls = null;
    var loaded = false;

    if (!video || !overlay || !streamUrl) {
      return;
    }

    function hideOverlay() {
      overlay.classList.add("is-hidden");
    }

    function showOverlay() {
      if (video.paused) {
        overlay.classList.remove("is-hidden");
      }
    }

    function playVideo() {
      hideOverlay();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          showOverlay();
        });
      }
    }

    function loadStream() {
      if (loaded) {
        playVideo();
        return;
      }

      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal || !hls) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }

          hls.destroy();
          hls = null;
          loaded = false;
          showOverlay();
        });
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        playVideo();
      }
    }

    overlay.addEventListener("click", loadStream);

    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        loadStream();
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        loadStream();
      }
    });

    video.addEventListener("pause", showOverlay);
    video.addEventListener("play", hideOverlay);
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.SitePlayer = {
    setup: setup
  };
})();
