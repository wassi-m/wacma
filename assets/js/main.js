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


  const MIN_PRELOAD_TIME = 2000;
  const startTime = Date.now();

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
function getYouTubeID(url) {
  try {
    const u = new URL(url);
    // watch?v=ID
    const v = u.searchParams.get("v");
    if (v && v.length === 11) return v;

    // youtu.be/ID or /embed/ID or /shorts/ID
    const parts = u.pathname.split("/");
    for (let i = parts.length - 1; i >= 0; i--) {
      const seg = parts[i];
      if (seg && seg.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(seg)) {
        return seg;
      }
    }
  } catch (e) {
    // fall through to regex if URL() fails
  }
  const regExp = /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// --- UI Builder ---
function createVideoCard({ id, title, artist }) {
  const card = document.createElement("div");
  card.className = "video-card";
  card.innerHTML = `
    <div class="video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/${id}?rel=0"
        title="${title} — ${artist}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>
    <div class="video-info">
      <h4 class="video-title">${title}</h4>
      <p class="video-artist">${artist}</p>
    </div>
  `;
  return card;
}

// --- Renderers ---
function renderAllToGallery() {
  const gallery = document.getElementById("video-gallery");
  if (!gallery) return;
  videos.forEach(v => {
    const id = getYouTubeID(v.url);
    if (!id) return;
    gallery.appendChild(createVideoCard({ id, title: v.title, artist: v.artist }));
  });
}

function renderLastSixToPreview() {
  const previewGrid = document.getElementById("previewGrid");
  if (!previewGrid) return;
  const lastSix = videos.slice(-6); // last 6 items
  lastSix.forEach(v => {
    const id = getYouTubeID(v.url);
    if (!id) return;
    previewGrid.appendChild(createVideoCard({ id, title: v.title, artist: v.artist }));
  });
}

// --- Page-aware bootstrapping ---
// If you're loading this on every page, both calls are safe (they no-op if the element isn't present).
renderAllToGallery();     // portfolio page: renders ALL when #video-gallery exists
renderLastSixToPreview(); // index page: renders LAST 6 when #previewGrid exists
