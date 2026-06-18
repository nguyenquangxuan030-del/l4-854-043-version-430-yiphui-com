(function () {
    function playBox(box) {
        var video = box.querySelector('video');
        var cover = box.querySelector('.player-cover');
        if (!video) {
            return;
        }
        var url = video.getAttribute('data-m3u8');
        if (!url) {
            return;
        }
        if (!video.getAttribute('src')) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }
        if (cover) {
            cover.classList.add('hidden');
        }
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {});
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
            var cover = box.querySelector('.player-cover');
            var video = box.querySelector('video');
            if (cover) {
                cover.addEventListener('click', function () {
                    playBox(box);
                });
            }
            if (video) {
                video.addEventListener('click', function () {
                    playBox(box);
                });
                video.addEventListener('play', function () {
                    if (cover) {
                        cover.classList.add('hidden');
                    }
                });
            }
        });
    });
}());
