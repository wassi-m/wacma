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

  // Split tagline into spans
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

  // Unmute & Repeat Button Logic
  unmuteBtn.addEventListener("click", () => {
    const state = unmuteBtn.dataset.state;

    if (state === "unmute") {
      audio.muted = false;
      unmuteBtn.dataset.state = "playing";

      // Fade in spans to 0.5
      tagline.querySelectorAll(".word").forEach((span) => {
        span.style.opacity = "0";
        span.style.transition = "opacity 0.4s ease";
        requestAnimationFrame(() => {
          span.style.opacity = "0.5";
        });
      });

      audio.currentTime = 0;
      audio.play().then(() => {
        console.log("Audio play() success");

        // Wait until audio reaches 1s
        function waitUntil1s() {
          if (audio.currentTime >= 1) {
            startAnimation();
          } else {
            requestAnimationFrame(waitUntil1s);
          }
        }
        waitUntil1s();
      }).catch((e) => {
        console.warn("Audio play failed", e);
      });

    } else if (state === "repeat") {
      unmuteBtn.dataset.state = "playing";
      tagline.classList.remove("animate");

      // Reset opacity
      tagline.querySelectorAll(".word").forEach((span) => {
        span.style.opacity = "0";
        requestAnimationFrame(() => {
          span.style.opacity = "0.5";
        });
      });

      audio.currentTime = 0;
      audio.play().then(() => {
        console.log("Audio restarted");

        function waitUntil1s() {
          if (audio.currentTime >= 1) {
            startAnimation();
          } else {
            requestAnimationFrame(waitUntil1s);
          }
        }
        waitUntil1s();
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
    });

    tagline.classList.add("animate");
    console.log(`Animation triggered at ${(Date.now() - startTime) / 1000}s`);

    // After animation ends, change to repeat button
    const totalDuration = baseDelay + totalDelayForLastWord + 0.5;
    setTimeout(() => {
      unmuteBtn.dataset.state = "repeat";
      console.log("Animation ended, ready to repeat");
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
  