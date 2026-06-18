(function () {
    function attach(video, url) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            return;
        }
        video.src = url;
    }

    window.initPlayer = function (url) {
        var video = document.getElementById("movie-player");
        var cover = document.getElementById("play-cover");
        if (!video || !cover || !url) {
            return;
        }
        var attached = false;

        function play() {
            if (!attached) {
                attach(video, url);
                attached = true;
            }
            cover.classList.add("is-hidden");
            video.controls = true;
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {});
            }
        }

        cover.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (!attached) {
                play();
            }
        });
    };
})();
