(function () {
    function initMoviePlayer(videoId, overlayId, sourceUrl) {
        const video = document.getElementById(videoId);
        const overlay = document.getElementById(overlayId);
        let attached = false;
        let hlsInstance = null;

        if (!video || !overlay || !sourceUrl) {
            return;
        }

        function attachSource() {
            if (attached) {
                video.play().catch(function () {});
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }

            overlay.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');
            video.play().catch(function () {});
        }

        overlay.addEventListener('click', attachSource);
        video.addEventListener('click', function () {
            if (!attached) {
                attachSource();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
