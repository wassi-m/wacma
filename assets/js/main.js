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
        span.style.opacity = "1";
        span.style.transition = "opacity 0.4s ease";
        requestAnimationFrame(() => {
          span.style.opacity = "0.5";
        });
      });

              // Step 1: Instantly disappear all wave lines with a short delay buffer
  [1, 2, 3, 4, 5].forEach(num => {
    const wave = document.querySelector(`.wave${num}`);
    wave.classList.remove("wave-group-animate", "wave-animate");
    wave.classList.add("wave-disappear");
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
        span.style.opacity = "1";
        requestAnimationFrame(() => {
          span.style.opacity = "0.5";
        });
      });

              // Step 1: Instantly disappear all wave lines with a short delay buffer
  [1, 2, 3, 4, 5].forEach(num => {
    const wave = document.querySelector(`.wave${num}`);
    wave.classList.remove("wave-group-animate", "wave-animate");
    wave.classList.add("wave-disappear");
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

    // Animate wave1 to wave5 with trimInOut
    if (index < 5) {
      const wave = document.querySelector(`.wave${index + 1}`);
      setTimeout(() => {
        wave.classList.remove("wave-animate", "wave-disappear", "wave-group-animate");
        void wave.offsetWidth;
        wave.classList.add("wave-animate");

        // After animation ends, force it to stay hidden
        setTimeout(() => {
          wave.classList.remove("wave-animate");
          wave.style.strokeDashoffset = "4000";
          wave.style.opacity = "0";
        }, 1000); // match trimInOut duration
      }, delay * 1000);
    }

if (index === arr.length - 1) {
  setTimeout(() => {
    [1, 2, 3].forEach((num, i) => {
      const wave = document.querySelector(`.wave${num}`);
      wave.classList.remove("wave-disappear", "wave-animate", "wave-group-animate");

      // Immediately hide wave before animation to prevent flicker
      wave.style.strokeDashoffset = "4000";
      wave.style.opacity = "0";

      void wave.offsetWidth;

      setTimeout(() => {
        // Clear inline styles before animating in
        wave.style.strokeDashoffset = null;
        wave.style.opacity = null;

        wave.classList.add("wave-group-animate");
      }, i * 100); // stagger delay
    });
  }, delay * 1000);
}

  });

  tagline.classList.add("animate");

  // Set button to repeat after full sequence
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
  