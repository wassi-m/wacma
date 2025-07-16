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

  // Helper: Reset wave before animation
  function resetWave(wave) {
    wave.classList.remove("wave-animate", "wave-group-animate", "wave-disappear", "wave-hidden");
    void wave.offsetWidth;
  }

  // Helper: Instantly hide wave with CSS class
  function hideWave(wave) {
    wave.classList.add("wave-hidden");
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

      // Instantly hide all waves
      [1, 2, 3, 4, 5].forEach(num => {
        const wave = document.querySelector(`.wave${num}`);
        resetWave(wave);
        hideWave(wave);
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

      // Animate wave1 to wave5 individually
      if (index < 5) {
        const wave = document.querySelector(`.wave${index + 1}`);
        setTimeout(() => {
          resetWave(wave);
          wave.classList.remove("wave-hidden");

          requestAnimationFrame(() => {
            wave.classList.add("wave-animate");

            // Remove wave-animate & hide again after animation
            setTimeout(() => {
              wave.classList.remove("wave-animate");
              wave.classList.add("wave-hidden");
            }, 1000);
          });
        }, delay * 1000);
      }

      // Final 3 waves animate in staggered
      if (index === arr.length - 1) {
        setTimeout(() => {
          [1, 2, 3].forEach((num, i) => {
            const wave = document.querySelector(`.wave${num}`);
            resetWave(wave);
            hideWave(wave);

            setTimeout(() => {
              wave.classList.remove("wave-hidden");
              requestAnimationFrame(() => {
                wave.classList.add("wave-group-animate");
              });
            }, i * 100); // stagger delay
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
