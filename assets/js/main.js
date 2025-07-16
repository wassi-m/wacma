document.addEventListener('DOMContentLoaded', () => {
  console.log('WACMA site loaded.');
});

window.addEventListener("load", () => {
  const MIN_PRELOAD_TIME = 2500;
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

  // Animate wave mask: expand, hold, collapse
  function animateMask(rect, expandTime = 800, holdTime = 200, collapseTime = 800) {
    rect.style.transition = `width ${expandTime}ms ease-in-out`;
    rect.style.width = '100%';

    setTimeout(() => {
      rect.style.transition = `width ${collapseTime}ms ease-in-out`;
      rect.style.width = '0';
    }, expandTime + holdTime);
  }

  // Instantly hide a wave mask
  function hideMask(num) {
    const rect = document.getElementById(`mask-rect${num}`);
    if (rect) {
      rect.style.transition = 'none';
      rect.style.width = '0';
    }
  }

  // Show wave mask and keep visible
  function showMask(num) {
    const rect = document.getElementById(`mask-rect${num}`);
    if (rect) {
      rect.style.transition = 'width 0.8s ease-in-out';
      rect.style.width = '100%';
    }
  }

  // Unmute button
  unmuteBtn.addEventListener("click", () => {
    const state = unmuteBtn.dataset.state;

    if (state === "unmute" || state === "repeat") {
      unmuteBtn.dataset.state = "playing";
      audio.muted = false;
      tagline.classList.remove("animate");

      // Fade tagline words to 0.5 opacity
      tagline.querySelectorAll(".word").forEach(span => {
        span.style.transition = "opacity 0.4s ease";
        span.style.opacity = "0.5";
      });

      // Instantly hide masks for wave1–5
      [1, 2, 3, 4, 5].forEach(hideMask);

      // Start audio, then wait until 1s mark
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

  function startAnimation() {
    const baseDelay = 0.2;
    const totalDelayForLastWord = 3.8;
    const beatDuration = 0.5;
    const spans = tagline.querySelectorAll(".word");

    // Instantly hide waves 1–3
    [1, 2, 3].forEach(hideMask);

    spans.forEach((span, index, arr) => {
      const delay = (index === arr.length - 1)
        ? baseDelay + totalDelayForLastWord
        : baseDelay + index * beatDuration;

      span.style.animationDelay = `${delay}s`;
      span.style.animationDuration = "0.2s";

      // Animate wave1–5 masks with delay
      if (index < 5) {
        const rect = document.getElementById(`mask-rect${index + 1}`);
        setTimeout(() => {
          if (rect) animateMask(rect);
        }, delay * 1000);
      }

      // Final: wave1–3 reappear and stay
      if (index === arr.length - 1) {
        setTimeout(() => {
          [1, 2, 3].forEach((num, i) => {
            setTimeout(() => {
              showMask(num);
            }, i * 120);
          });
        }, delay * 1000);
      }
    });

    tagline.classList.add("animate");

    const totalDuration = baseDelay + totalDelayForLastWord + 0.5;
    setTimeout(() => {
      unmuteBtn.dataset.state = "repeat";
    }, totalDuration * 1000);
  }
});

// Sticky Header on Scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("main-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
