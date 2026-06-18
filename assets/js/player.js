(function () {
    var activeHls = null;

    function getHlsClass() {
        return window.HlsBundle && window.HlsBundle.H ? window.HlsBundle.H : null;
    }

    function play(video) {
        var attempt = video.play();

        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {
                video.controls = true;
            });
        }
    }

    function loadStream(video, streamUrl) {
        var Hls = getHlsClass();

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            if (!video.src) {
                video.src = streamUrl;
            }

            play(video);
            return;
        }

        if (Hls && Hls.isSupported()) {
            if (!activeHls) {
                activeHls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                activeHls.attachMedia(video);
                activeHls.on(Hls.Events.MEDIA_ATTACHED, function () {
                    activeHls.loadSource(streamUrl);
                });
                activeHls.on(Hls.Events.MANIFEST_PARSED, function () {
                    play(video);
                });
            } else {
                play(video);
            }

            return;
        }

        if (!video.src) {
            video.src = streamUrl;
        }

        play(video);
    }

    window.StreamPlayer = {
        init: function (streamUrl) {
            var video = document.getElementById("playerVideo");
            var cover = document.getElementById("playerCover");

            if (!video || !streamUrl) {
                return;
            }

            function start() {
                if (cover) {
                    cover.classList.add("is-hidden");
                }

                loadStream(video, streamUrl);
            }

            if (cover) {
                cover.addEventListener("click", start);
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
        }
    };
})();
