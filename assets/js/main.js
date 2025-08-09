document.addEventListener('DOMContentLoaded', () => {
  console.log('WACMA site loaded.');
});

window.addEventListener("load", () => {

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
});}


  const MIN_PRELOAD_TIME = 2000;
  const startTime = Date.now();

if (waveElement) {
  const audio = document.getElementById("jingle");
  const tagline = document.getElementById("tagline");
  const unmuteBtn = document.getElementById("unmute-btn");

  audio.muted = true;
  unmuteBtn.dataset.state = "unmute";

  // Split tagline text into individual word spans
  const words = tagline.textContent.trim().split(/\s+/);
  tagline.textContent = "";
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.className = "word";
    tagline.appendChild(span);
    if (index !== words.length - 1) tagline.appendChild(document.createTextNode(" "));
  });
}

  const remainingTime = MIN_PRELOAD_TIME - (Date.now() - startTime);

  setTimeout(() => {
    document.body.classList.add("loaded");
    console.log(`Preloader ended at ${(Date.now() - startTime) / 1000}s`);
  }, remainingTime > 0 ? remainingTime : 0);

  // Utility: Reset a wave element before animation to avoid flicker
  function resetWave(wave) {
    wave.classList.remove("wave-animate", "wave-group-animate", "wave-disappear");
    wave.style.opacity = "";
    wave.style.strokeDashoffset = "";
    wave.style.transition = "none";
    void wave.offsetWidth; // reflow
    wave.style.transition = "";
  }

  function startWaveAnimation(wave) {
    resetWave(wave);
    setTimeout(() => {
      wave.classList.add("wave-animate");
    }, 20);
  }

  // Unmute & Repeat Button Logic
  unmuteBtn.addEventListener("click", () => {
    const state = unmuteBtn.dataset.state;

    if (state === "unmute" || state === "repeat") {
      unmuteBtn.dataset.state = "playing";
      audio.muted = false;
      tagline.classList.remove("animate");

      // Fade text from 1 to 0.5 smoothly (no full fade out)
      tagline.querySelectorAll(".word").forEach(span => {
        span.style.transition = "opacity 0.4s ease";
        span.style.opacity = "0.5";
      });

      // Immediately reset all waves to hidden with no flicker
      [1, 2, 3, 4, 5].forEach(num => {
        const wave = document.querySelector(`.wave${num}`);
        resetWave(wave);
        wave.classList.add("wave-disappear");
      });

      audio.currentTime = 0;
      audio.play().then(() => {
        const waitUntil1s = () => {
          if (audio.currentTime >= 1) {
            startAnimation();
          } else {
            requestAnimationFrame(waitUntil1s);
          }
        };
        waitUntil1s();
      }).catch(e => {
        console.warn("Audio play failed", e);
      });
    }
  });

  // Main animation function
  function startAnimation() {
    const baseDelay = 0.2;
    const totalDelayForLastWord = 3.8;
    const beatDuration = 0.5;
    const spans = tagline.querySelectorAll(".word");

    spans.forEach((span, index, arr) => {
      const delay = (index === arr.length - 1)
        ? baseDelay + totalDelayForLastWord
        : baseDelay + index * beatDuration;

      span.style.animationDelay = `${delay}s`;
      span.style.animationDuration = "0.2s";

      // Animate wave1 to wave5 with trimInOut effect on corresponding word
      if (index < 5) {
        const wave = document.querySelector(`.wave${index + 1}`);
        setTimeout(() => {
          resetWave(wave);
          wave.classList.remove("wave-disappear");
          wave.classList.add("wave-animate");

          // After animation ends, hide the wave again
          setTimeout(() => {
            wave.classList.remove("wave-animate");
            wave.style.strokeDashoffset = "4000";
            wave.style.opacity = "0";
          }, 1000); // duration matches CSS animation
        }, delay * 1000);
      }

      // On last word: animate wave1 to wave3 appearing with staggered delay (100ms each)
      if (index === arr.length - 1) {
        setTimeout(() => {
          [1, 2, 3].forEach((num, i) => {
            const wave = document.querySelector(`.wave${num}`);
            resetWave(wave);

            // Immediately hide wave to prevent flicker
            wave.style.strokeDashoffset = "4000";
            wave.style.opacity = "0";

            void wave.offsetWidth;

            setTimeout(() => {
              wave.style.strokeDashoffset = null;
              wave.style.opacity = null;
              wave.classList.add("wave-group-animate");
            }, i * 100); // stagger 100ms delay
          });
        }, delay * 1000);
      }
    });

    tagline.classList.add("animate");

    // After the whole sequence, allow repeating again
    const totalDuration = baseDelay + totalDelayForLastWord + 0.5;
    setTimeout(() => {
      unmuteBtn.dataset.state = "repeat";
    }, totalDuration * 1000);
  }
});

window.addEventListener("scroll", () => {
  const header = document.getElementById("main-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// --- Data: include title + artist for each video ---
const videos = [
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley"
  },
  {
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth"
  },
  {
    url: "https://www.youtube.com/watch?v=l9nh1l8ZIJQ",
    title: "Sunflower",
    artist: "Post Malone, Swae Lee"
  },
  // repeat / add your items here...
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley"
  },
  {
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth"
  },
  {
    url: "https://www.youtube.com/watch?v=l9nh1l8ZIJQ",
    title: "Sunflower",
    artist: "Post Malone, Swae Lee"
  },
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley"
  },
  {
    url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth"
  },
  {
    url: "https://www.youtube.com/watch?v=l9nh1l8ZIJQ",
    title: "Sunflower",
    artist: "Post Malone, Swae Lee"
  }
];

// --- Helper: robust YouTube ID parser (handles youtu.be, watch?v=, embed, etc.) ---
// Get YT ID (same helper you already have)
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

// Build a thumbnail card (no iframe in grid)
function createVideoCardThumb({ id, title, artist, url }) {
  const card = document.createElement("div");
  card.className = "video-card";

  // YouTube thumbnail: hqdefault.jpg (or maxresdefault if available; hq is safest)
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  card.innerHTML = `
    <div class="video-thumb" data-video="${id}" aria-label="Play ${title} — ${artist}" role="button" tabindex="0">
      <img src="${thumb}" alt="${title} — ${artist}">
      <div class="video-play">
        <div class="play-circle">
          <div class="play-triangle"></div>
        </div>
      </div>
    </div>
    <div class="video-info">
      <h4 class="video-title">${title}</h4>
      <p class="video-artist">${artist}</p>
    </div>
  `;

  // Click / keyboard to open lightbox
  const trigger = card.querySelector(".video-thumb");
  const open = () => openLightbox(id, title, artist);
  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });

  return card;
}

// Renderers (use the thumbnail card now)
function renderAllToGallery() {
  const gallery = document.getElementById("video-gallery");
  if (!gallery) return;
  videos.forEach(v => {
    const id = getYouTubeID(v.url);
    if (!id) return;
    gallery.appendChild(createVideoCardThumb({ id, title: v.title, artist: v.artist, url: v.url }));
  });
}

function renderLastSixToPreview() {
  const previewGrid = document.getElementById("previewGrid");
  if (!previewGrid) return;
  videos.slice(-6).forEach(v => {
    const id = getYouTubeID(v.url);
    if (!id) return;
    previewGrid.appendChild(createVideoCardThumb({ id, title: v.title, artist: v.artist, url: v.url }));
  });
}

/* ---------- Modal / Lightbox ---------- */
let lightboxEl;

function ensureLightbox() {
  if (lightboxEl) return lightboxEl;
  lightboxEl = document.createElement("div");
  lightboxEl.className = "lightbox";
  lightboxEl.innerHTML = `
    <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Video player">
      <button class="lightbox-close" aria-label="Close">✕</button>
      <!-- iframe inserted dynamically -->
    </div>
  `;
  document.body.appendChild(lightboxEl);

  // Close interactions
  lightboxEl.addEventListener("click", (e) => {
    // Close when clicking outside the inner panel
    if (e.target === lightboxEl) closeLightbox();
  });
  lightboxEl.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxEl.classList.contains("is-open")) closeLightbox();
  });

  return lightboxEl;
}

function openLightbox(id, title, artist) {
  const lb = ensureLightbox();
  const inner = lb.querySelector(".lightbox-inner");

  // Clean previous player
  const old = inner.querySelector("iframe");
  if (old) old.remove();

  // Build player (nocookie + modest params)
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  const iframe = document.createElement("iframe");
  iframe.className = "lightbox-player";
  iframe.src = src;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.title = `${title} — ${artist}`;
  inner.appendChild(iframe);

  // Show
  lb.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  // Stop video by removing iframe
  const iframe = lightboxEl.querySelector("iframe");
  if (iframe) iframe.remove();
}

// Make sure DOM exists
document.addEventListener("DOMContentLoaded", () => {
  renderAllToGallery();
  renderLastSixToPreview();
});
