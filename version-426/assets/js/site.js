import { H as Hls } from "./hls-dru42stk.js";

const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

ready(() => {
  initMobileNavigation();
  initHeaderSearch();
  initHeroCarousel();
  initLocalFilters();
  initSearchPage();
  initVideoPlayers();
  initBackToTop();
});

function initMobileNavigation() {
  const button = document.querySelector("[data-mobile-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");

  if (!button || !menu) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

function initHeaderSearch() {
  document.querySelectorAll("[data-site-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const query = input ? input.value.trim() : "";

      if (query) {
        const prefix = form.dataset.root || "";
        window.location.href = `${prefix}search.html?q=${encodeURIComponent(query)}`;
      }
    });
  });
}

function initHeroCarousel() {
  const hero = document.querySelector("[data-hero]");

  if (!hero) {
    return;
  }

  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  let activeIndex = 0;

  if (slides.length <= 1) {
    return;
  }

  const show = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => show(index));
  });

  setInterval(() => show(activeIndex + 1), 5200);
}

function initLocalFilters() {
  document.querySelectorAll("[data-filter-input]").forEach((input) => {
    const targetSelector = input.dataset.filterInput;
    const cards = Array.from(document.querySelectorAll(targetSelector));
    const counter = document.querySelector(input.dataset.filterCounter || "");

    input.addEventListener("input", () => {
      const query = normalize(input.value);
      let visibleCount = 0;

      cards.forEach((card) => {
        const haystack = normalize(card.dataset.filterText || card.textContent);
        const visible = !query || haystack.includes(query);
        card.style.display = visible ? "" : "none";
        if (visible) {
          visibleCount += 1;
        }
      });

      if (counter) {
        counter.textContent = `${visibleCount} 个结果`;
      }
    });
  });
}

function initSearchPage() {
  const form = document.querySelector("[data-search-page]");
  const results = document.querySelector("[data-search-results]");

  if (!form || !results || !window.MOVIE_SEARCH_INDEX) {
    return;
  }

  const input = form.querySelector("[name='q']");
  const typeSelect = form.querySelector("[name='type']");
  const regionSelect = form.querySelector("[name='region']");
  const count = document.querySelector("[data-search-count]");
  const params = new URLSearchParams(window.location.search);

  input.value = params.get("q") || "";
  typeSelect.value = params.get("type") || "";
  regionSelect.value = params.get("region") || "";

  const render = () => {
    const query = normalize(input.value);
    const type = normalize(typeSelect.value);
    const region = normalize(regionSelect.value);

    const matched = window.MOVIE_SEARCH_INDEX.filter((movie) => {
      const text = normalize(`${movie.title} ${movie.description} ${movie.tags} ${movie.genre} ${movie.region} ${movie.type}`);
      const matchesQuery = !query || text.includes(query);
      const matchesType = !type || normalize(movie.type) === type;
      const matchesRegion = !region || normalize(movie.region) === region;
      return matchesQuery && matchesType && matchesRegion;
    }).slice(0, 120);

    results.innerHTML = matched.map((movie) => `
      <a class="result-card" href="${movie.url}">
        <img src="${movie.cover}" alt="${escapeHtml(movie.title)}" loading="lazy">
        <div>
          <h3>${escapeHtml(movie.title)}</h3>
          <div class="result-meta">
            <span>${escapeHtml(movie.year)}</span>
            <span>${escapeHtml(movie.region)}</span>
            <span>${escapeHtml(movie.type)}</span>
            <span class="rating">★ ${escapeHtml(movie.rating)}</span>
          </div>
          <p>${escapeHtml(movie.description)}</p>
        </div>
      </a>
    `).join("");

    if (matched.length === 0) {
      results.innerHTML = `<div class="empty-state">没有找到匹配影片，请尝试更换关键词或筛选条件。</div>`;
    }

    if (count) {
      count.textContent = `${matched.length} 个结果`;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  [input, typeSelect, regionSelect].forEach((element) => {
    element.addEventListener("input", render);
    element.addEventListener("change", render);
  });

  render();
}

function initVideoPlayers() {
  document.querySelectorAll("[data-video-player]").forEach((player) => {
    const video = player.querySelector("video");
    const overlay = player.querySelector("[data-video-overlay]");
    const status = player.querySelector("[data-video-status]");
    const source = player.dataset.videoSrc;
    let initialized = false;
    let hlsInstance = null;

    if (!video || !source) {
      return;
    }

    const setStatus = (message) => {
      if (status) {
        status.textContent = message;
      }
    };

    const attachSource = () => {
      if (initialized) {
        return;
      }

      initialized = true;
      setStatus("正在加载高清播放源...");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);

        const manifestParsedEvent = (Hls.Events && Hls.Events.MANIFEST_PARSED) || "hlsManifestParsed";
        const errorEvent = (Hls.Events && Hls.Events.ERROR) || "hlsError";

        hlsInstance.on(manifestParsedEvent, () => {
          setStatus("播放源已就绪，点击画面可继续控制播放。正常播放取决于网络与源站可访问性。");
        });

        hlsInstance.on(errorEvent, (_event, data) => {
          if (data && data.fatal) {
            setStatus("播放源加载失败，请稍后重试或检查网络连接。");
          }
        });
      } else {
        setStatus("当前浏览器不支持 HLS 播放，请使用新版 Chrome、Safari、Edge 或 Firefox。 ");
      }
    };

    const startPlayback = async () => {
      attachSource();

      try {
        await video.play();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      } catch (error) {
        setStatus("浏览器阻止了自动播放，请再次点击播放按钮。 ");
      }
    };

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("play", () => {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", () => {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });

    video.addEventListener("error", () => {
      setStatus("视频播放出现错误，请刷新页面或稍后再试。 ");
    });

    window.addEventListener("beforeunload", () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
}

function initBackToTop() {
  const button = document.querySelector("[data-back-to-top]");

  if (!button) {
    return;
  }

  const update = () => {
    button.classList.toggle("is-visible", window.scrollY > 360);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
