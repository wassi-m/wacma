document.addEventListener('DOMContentLoaded', () => {
    console.log('WACMA site loaded.');
  });

  const audio = document.getElementById('jingle');
  const unmuteBtn = document.getElementById('unmute-btn');
  
  unmuteBtn.addEventListener('click', () => {
    audio.muted = false;
    unmuteBtn.classList.add('unmuted');
    unmuteBtn.disabled = true; // optional: disable after unmuting
  });
  
  


  window.addEventListener("load", () => {
    const MIN_PRELOAD_TIME = 2000; // 2 seconds total preloader time
    const startTime = Date.now();
  
    const audio = document.getElementById("jingle");
    const tagline = document.getElementById("tagline");
    const unmuteBtn = document.getElementById("unmute-btn"); // make sure you have this
  
    let userUnmuted = false;
  
    // Start audio muted to avoid autoplay errors
    audio.muted = true;
  
    // Immediately split words into spans with opacity 0.5 and insert
    const words = tagline.textContent.trim().split(/\s+/);
    tagline.textContent = "";
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.className = "word";
      span.style.opacity = "0.5";
      tagline.appendChild(span);
      if (index !== words.length - 1) {
        tagline.appendChild(document.createTextNode(" "));
      }
    });
  
    // Unmute button logic
    unmuteBtn.addEventListener("click", () => {
      userUnmuted = true;
      audio.muted = false;
      console.log("User unmuted audio");
    });
  
    const timeElapsed = Date.now() - startTime;
    const remainingTime = MIN_PRELOAD_TIME - timeElapsed;
  
    setTimeout(() => {
      document.body.classList.add("loaded");
      console.log(`Preloader ended at ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  
      audio.play().then(() => {
        console.log(`Audio play() called at ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
      }).catch(() => {
        console.warn("Audio playback failed");
        // If audio fails, fallback: animate immediately without last word delay & faster
        startAnimation(false, true);
      });
  
      // If user hasn't unmuted by this point, start fallback animation without last word delay & faster + 0.5s start delay
      setTimeout(() => {
        if (!userUnmuted) {
          console.log("User did not unmute, running fallback faster animation with 0.5s start delay");
          startAnimation(false, true, 0.5);
        }
      }, 3000);
  
    }, remainingTime > 0 ? remainingTime : 0);
  
    audio.addEventListener("playing", () => {
        console.log(`Audio actually playing at ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
      
        function checkAudioTime() {
          if (audio.currentTime >= 1) {
            startAnimation(true, false);
          } else {
            requestAnimationFrame(checkAudioTime);
          }
        }
        requestAnimationFrame(checkAudioTime);
      });
      
  
    /**
     * 
     * @param {boolean} withLastWordDelay - whether to apply special last word delay
     * @param {boolean} faster - whether to run faster animation (shorter durations and delays)
     * @param {number} startDelay - optional extra start delay in seconds (default 0)
     */
    function startAnimation(withLastWordDelay, faster, startDelay = 0) {
      const baseDelay = (faster ? 0.1 : 0.2) + startDelay; // add startDelay here
      const totalDelayForLastWord = faster ? 2.0 : 3.8;
      const beatDuration = faster ? 0.25 : 0.5;
  
      const spans = tagline.querySelectorAll(".word");
  
      spans.forEach((span, index) => {
        let delay;
        if (withLastWordDelay && index === spans.length - 1) {
          delay = baseDelay + totalDelayForLastWord;
        } else {
          delay = baseDelay + index * beatDuration;
        }
        span.style.animationDelay = `${delay}s`;
  
        // Override animation duration for faster case
        span.style.animationDuration = faster ? "0.1s" : "0.2s";
      });
  
      tagline.classList.add("animate");
      console.log(`Animation triggered withLastWordDelay=${withLastWordDelay}, faster=${faster}, startDelay=${startDelay}s at ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
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
  
