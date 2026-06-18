(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector("[data-play-button]");
    var stream = video ? video.getAttribute("data-stream") : "";
    var hlsInstance = null;

    function attachStream() {
      if (!video || !stream || video.getAttribute("data-ready") === "true") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      video.setAttribute("data-ready", "true");
      shell.hlsInstance = hlsInstance;
    }

    function play() {
      if (!video) {
        return;
      }

      attachStream();

      if (button) {
        button.classList.add("is-hidden");
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.getAttribute("data-ready") !== "true") {
          play();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll("[data-player]").forEach(setupPlayer);
    });
  } else {
    document.querySelectorAll("[data-player]").forEach(setupPlayer);
  }
})();
