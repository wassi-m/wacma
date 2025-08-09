/* =========================================================
   WACMA — main.js (drop-in)
   ========================================================= */

/* ---------- Tiny helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================================================
   Brand → Home & Header (native fallback)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Brand click → home
  const brandEl = $(".brand");
  if (brandEl) {
    brandEl.style.cursor = "pointer";
    brandEl.addEventListener("click", () => {
      window.location.href = "index.html"; // adjust if hosted at a subpath
    });
  }

  // Header scrolled (window scroll fallback)
  const header = $("#main-header");
  if (header) {
    const onWinScroll = () => {
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onWinScroll, { passive: true });
  }
});

/* =========================================================
   YouTube data + helpers (title + artist)
   ========================================================= */
// Example: add meta fields (type, year, client, tags)
const videos = [
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    type: "Lyric Video",
    year: 2024,
    client: "RCA",
    tags: ["80s", "Pop", "Viral"]
  },
  {
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    type: "Music Video",
    year: 2015,
    client: "Atlantic",
    tags: ["Hip-Hop", "Soundtrack", "Top100"]
  },
  {
    url: "https://www.youtube.com/watch?v=l9nh1l8ZIJQ",
    title: "Sunflower",
    artist: "Post Malone, Swae Lee",
    type: "Visualizer",
    year: 2018,
    client: "Republic",
    tags: ["Pop", "Animated", "Spider-Verse"]
  },
    {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    type: "Lyric Video",
    year: 2024,
    client: "RCA",
    tags: ["80s", "Pop", "Viral"]
  },
  {
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    type: "Music Video",
    year: 2015,
    client: "Atlantic",
    tags: ["Hip-Hop", "Soundtrack", "Top100"]
  },
  {
    url: "https://www.youtube.com/watch?v=l9nh1l8ZIJQ",
    title: "Sunflower",
    artist: "Post Malone, Swae Lee",
    type: "Visualizer",
    year: 2018,
    client: "Republic",
    tags: ["Pop", "Animated", "Spider-Verse"]
  },

    {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    type: "Lyric Video",
    year: 2024,
    client: "RCA",
    tags: ["80s", "Pop", "Viral"]
  },
  {
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    type: "Music Video",
    year: 2015,
    client: "Atlantic",
    tags: ["Hip-Hop", "Soundtrack", "Top100"]
  },
  {
    url: "https://www.youtube.com/watch?v=l9nh1l8ZIJQ",
    title: "Sunflower",
    artist: "Post Malone, Swae Lee",
    type: "Visualizer",
    year: 2018,
    client: "Republic",
    tags: ["Pop", "Animated", "Spider-Verse"]
  },

];

// ---------- Build selects & chips from data ----------
function collectUnique(arr, key){
  const set = new Set();
  arr.forEach(v => { if (v[key] != null) set.add(v[key]); });
  return Array.from(set);
}
function collectUniqueTags(arr){
  const set = new Set();
  arr.forEach(v => (v.tags || []).forEach(t => set.add(t)));
  return Array.from(set);
}

function populateFilters(){
  const typeEl = document.getElementById("filter-type");
  const chipWrap = document.getElementById("filter-chips");
  if (!typeEl || !chipWrap) return;

  // Types (pulled directly from videos[].type)
  const types = collectUnique(videos, "type").sort();
  // keep the first "All types" option; clear the rest
  [...typeEl.querySelectorAll("option:not(:first-child)")].forEach(o => o.remove());
  types.forEach(t => {
    const o = document.createElement("option");
    o.value = t; o.textContent = t;
    typeEl.appendChild(o);
  });

  // Tag chips
  chipWrap.innerHTML = "";
  const tags = collectUniqueTags(videos).sort();
  tags.forEach(tag => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = tag;
    b.setAttribute("aria-pressed", "false");
    b.dataset.tag = tag;
    chipWrap.appendChild(b);
  });
}

// ---------- Filter + render ----------
const state = {
  q: "",
  type: "",
  tags: new Set()
};

function normalize(s){ return (s || "").toString().toLowerCase(); }

function matchesSearch(v, q){
  if (!q) return true;
  const hay = [
    v.title, v.artist, v.client,
    ...(v.tags || [])
  ].map(normalize).join(" ");
  return hay.includes(normalize(q));
}
function matchesType(v, type){ return !type || (v.type === type); }
function matchesTags(v, activeTags){
  if (!activeTags.size) return true;
  const t = new Set(v.tags || []);
  for (const tag of activeTags) if (!t.has(tag)) return false;
  return true;
}

function applyFilters(){
  const gallery = document.getElementById("video-gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  const filtered = videos.filter(v =>
    matchesSearch(v, state.q) &&
    matchesType(v, state.type) &&
    matchesTags(v, state.tags)
  );

  if (filtered.length === 0){
    const empty = document.createElement("p");
    empty.style.opacity = ".7";
    empty.textContent = "No projects match your filters.";
    gallery.appendChild(empty);
    return;
  }

  filtered.forEach(v => {
    const id = getYouTubeID(v.url);
    if (!id) return;
    gallery.appendChild(createVideoCardThumb({
      id, title: v.title, artist: v.artist
    }));
  });
}

// ---------- Wire up controls ----------
function initPortfolioFilters(){
  const searchEl = document.getElementById("filter-search");
  const typeEl = document.getElementById("filter-type");
  const clearBtn = document.getElementById("filter-clear");
  const chipsWrap = document.getElementById("filter-chips");
  const gallery = document.getElementById("video-gallery");
  if (!gallery || !searchEl || !typeEl || !clearBtn || !chipsWrap) return;

  populateFilters();

  // debounce search
  let t;
  const debounced = (fn, d=200) => (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), d); };

  searchEl.addEventListener("input", debounced(() => {
    state.q = searchEl.value;
    applyFilters();
  }, 250));

  typeEl.addEventListener("change", () => {
    state.type = typeEl.value;
    applyFilters();
  });

  chipsWrap.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const tag = chip.dataset.tag;
    const pressed = chip.getAttribute("aria-pressed") === "true";
    chip.setAttribute("aria-pressed", pressed ? "false" : "true");
    if (pressed) state.tags.delete(tag);
    else state.tags.add(tag);
    applyFilters();
  });

  clearBtn.addEventListener("click", () => {
    state.q = ""; state.type = ""; state.tags.clear();
    searchEl.value = "";
    typeEl.value = "";
    chipsWrap.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", "false"));
    applyFilters();
  });

  // initial render (filters inactive)
  applyFilters();
}



function getYouTubeID(url) {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v && v.length === 11) return v;
    const segs = u.pathname.split("/").filter(Boolean);
    for (let i = segs.length - 1; i >= 0; i--) {
      const s = segs[i];
      if (/^[\w-]{11}$/.test(s)) return s;
    }
  } catch {}
  const m = url.match(/(?:youtu\.be\/|v\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/);
  return m ? m[1] : null;
}

/* ---------- Thumbnail card (no iframe in grid) ---------- */
function createVideoCardThumb({ id, title, artist }) {
  const card = document.createElement("div");
  card.className = "video-card";
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  card.innerHTML = `
    <div class="video-thumb" data-video="${id}" aria-label="Play ${title} — ${artist}" role="button" tabindex="0">
      <img src="${thumb}" alt="${title} — ${artist}">
      <div class="video-play"><div class="play-circle"><div class="play-triangle"></div></div></div>
    </div>
    <div class="video-info">
      <h4 class="video-title">${title}</h4>
      <p class="video-artist">${artist}</p>
    </div>
  `;
  const trigger = $(".video-thumb", card);
  const open = () => openLightbox(id, title, artist);
  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
  return card;
}

function renderAllToGallery() {
  const gallery = $("#video-gallery");
  if (!gallery) return;
  videos.forEach(v => {
    const id = getYouTubeID(v.url);
    if (id) gallery.appendChild(createVideoCardThumb({ id, title: v.title, artist: v.artist }));
  });
}

function renderLastSixToPreview() {
  const container = $("#previewGrid");
  if (!container) return;
  videos.slice(-3).forEach(v => {
    const id = getYouTubeID(v.url);
    if (id) container.appendChild(createVideoCardThumb({ id, title: v.title, artist: v.artist }));
  });
}

/* ---------- Boot grids ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const isPortfolio = document.getElementById("video-gallery");
  const isIndex = document.getElementById("previewGrid");

  if (isPortfolio) {
    // USE FILTERED RENDER ON PORTFOLIO
    initPortfolioFilters();
  }
  if (isIndex) {
    // still show last 6 on index
    renderLastSixToPreview();
  }
});

/* =========================================================
   Lightbox modal
   ========================================================= */
let lightboxEl;
function ensureLightbox() {
  if (lightboxEl) return lightboxEl;
  lightboxEl = document.createElement("div");
  lightboxEl.className = "lightbox";
  lightboxEl.innerHTML = `
    <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Video player">
      <button class="lightbox-close" aria-label="Close">✕</button>
    </div>
  `;
  document.body.appendChild(lightboxEl);

  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
  $(".lightbox-close", lightboxEl)?.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxEl.classList.contains("is-open")) closeLightbox();
  });

  return lightboxEl;
}

function openLightbox(id, title, artist) {
  const lb = ensureLightbox();
  const inner = $(".lightbox-inner", lb);
  const old = $("iframe", inner);
  if (old) old.remove();

  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  const iframe = document.createElement("iframe");
  iframe.className = "lightbox-player";
  iframe.src = src;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.title = `${title} — ${artist}`;
  inner.appendChild(iframe);

  lb.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  const iframe = $("iframe", lightboxEl);
  if (iframe) iframe.remove();
}

/* =========================================================
   Preloader + Audio/Waves (guarded)
   ========================================================= */
window.addEventListener("load", () => {
  const MIN_PRELOAD_TIME = 2000;
  const startTime = Date.now();

  const hasWaves = !!$(".wave1");
  const audio = $("#jingle");
  const tagline = $("#tagline");
  const unmuteBtn = $("#unmute-btn");

  if (hasWaves && audio && tagline && unmuteBtn) {
    audio.muted = true;
    unmuteBtn.dataset.state = "unmute";

    // Split tagline to spans once
    if (!tagline.dataset.split) {
      const words = (tagline.textContent || "").trim().split(/\s+/);
      tagline.textContent = "";
      words.forEach((word, idx) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.className = "word";
        tagline.appendChild(span);
        if (idx !== words.length - 1) tagline.appendChild(document.createTextNode(" "));
      });
      tagline.dataset.split = "1";
    }

    const resetWave = (wave) => {
      if (!wave) return;
      wave.classList.remove("wave-animate", "wave-group-animate", "wave-disappear");
      wave.style.opacity = "";
      wave.style.strokeDashoffset = "";
      wave.style.transition = "none";
      void wave.offsetWidth; // reflow
      wave.style.transition = "";
    };

    const startAnimation = () => {
      const baseDelay = 0.2;
      const totalDelayForLastWord = 3.8;
      const beatDuration = 0.5;
      const spans = $$(".word", tagline);

      spans.forEach((span, index, arr) => {
        const delay = (index === arr.length - 1)
          ? baseDelay + totalDelayForLastWord
          : baseDelay + index * beatDuration;

        span.style.animationDelay = `${delay}s`;
        span.style.animationDuration = "0.2s";

        if (index < 5) {
          const wave = $(`.wave${index + 1}`);
          setTimeout(() => {
            resetWave(wave);
            wave?.classList.remove("wave-disappear");
            wave?.classList.add("wave-animate");
            setTimeout(() => {
              wave?.classList.remove("wave-animate");
              if (wave) {
                wave.style.strokeDashoffset = "4000";
                wave.style.opacity = "0";
              }
            }, 1000);
          }, delay * 1000);
        }

        if (index === arr.length - 1) {
          setTimeout(() => {
            [1, 2, 3].forEach((num, i) => {
              const wave = $(`.wave${num}`);
              resetWave(wave);
              if (wave) {
                wave.style.strokeDashoffset = "4000";
                wave.style.opacity = "0";
                void wave.offsetWidth;
                setTimeout(() => {
                  wave.style.strokeDashoffset = "";
                  wave.style.opacity = "";
                  wave.classList.add("wave-group-animate");
                }, i * 100);
              }
            });
          }, delay * 1000);
        }
      });

      tagline.classList.add("animate");
      setTimeout(() => { unmuteBtn.dataset.state = "repeat"; }, (baseDelay + totalDelayForLastWord + 0.5) * 1000);
    };

    // Unmute / Repeat
    unmuteBtn.addEventListener("click", () => {
      const state = unmuteBtn.dataset.state;
      if (state === "unmute" || state === "repeat") {
        unmuteBtn.dataset.state = "playing";
        audio.muted = false;
        tagline.classList.remove("animate");
        $$(".word", tagline).forEach(span => {
          span.style.transition = "opacity 0.4s ease";
          span.style.opacity = "0.5";
        });

        [1, 2, 3, 4, 5].forEach(num => {
          const wave = $(`.wave${num}`);
          resetWave(wave);
          wave?.classList.add("wave-disappear");
        });

        audio.currentTime = 0;
        audio.play().then(() => {
          const waitUntil1s = () => {
            if (audio.currentTime >= 1) startAnimation();
            else requestAnimationFrame(waitUntil1s);
          };
          waitUntil1s();
        }).catch(e => console.warn("Audio play failed", e));
      }
    });
  }

  // End preloader after minimum time
  const remaining = MIN_PRELOAD_TIME - (Date.now() - startTime);
  setTimeout(() => { document.body.classList.add("loaded"); }, Math.max(0, remaining));
});

/* =========================================================
   Locomotive + ScrollTrigger + Parallax (YOUR EXACT SNIPPET)
   ========================================================= */
window.addEventListener("load", () => {
  // >>> YOUR SNIPPET STARTS HERE (unchanged) <<<
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    // optional: multiplier: 1.2, class: 'is-reveal'
  });
  gsap.registerPlugin(ScrollTrigger);

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  const waveElement = document.querySelector('.wave1');
  if (waveElement) {

    gsap.to(".hero-bg", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        scroller: "[data-scroll-container]",
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
  // >>> YOUR SNIPPET ENDS HERE <<<
});
