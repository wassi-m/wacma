<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>W/A Creative Music Agency</title>
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
    
<!-- Preloader -->
<div id="preloader">
  <div class="loader-logo"><img src="assets/img/wacma-icon.svg" alt="Logo" /></div>
  <button id="unmute-btn" aria-label="Unmute audio" title="Unmute audio"></button>
  <div class="loader-message">Unmute to experience the sound</div>
</div>




  <!-- Header -->
  <header id="main-header">
  <nav class="navbar">
    <div class="brand">
      <span>W/A Creative Music Agency</span>
    </div>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#work">Work</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>

<audio id="jingle" src="assets/audio/jingle.mp3"></audio>
<section class="hero" id="hero">
    <h1 id="tagline">Visuals that never miss a beat</h1>
</section>


  <!-- Main Content -->
  <main>
    <section id="about">
      <h2>About Us</h2>
      <p>We are a creative agency pushing boundaries in music, sound, and visuals.</p>
    </section>

    <section id="work">
      <h2>Our Work</h2>
      <p>Showcase of projects will go here.</p>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <form action="contact.php" method="POST">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send</button>
      </form>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    <p>© <?= date("Y") ?> W/A Creative Music Agency. All rights reserved.</p>
  </footer>

  <script src="assets/js/main.js"></script>
</body>
</html>
