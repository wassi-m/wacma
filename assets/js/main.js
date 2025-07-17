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

