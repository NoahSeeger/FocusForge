const quotes = [
  "Stay focused, go after your dreams and keep moving toward your goals.",
  "The successful warrior is the average man, with laser-like focus.",
  "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
  "It's not that I'm so smart, it's just that I stay with problems longer.",
  "Where focus goes, energy flows.",
];

const videos = [
  "https://www.youtube.com/embed/fLeJJPxua3E?autoplay=1&mute=0",
  // Fügen Sie weitere Video-URLs hinzu, wie benötigt
];

document.addEventListener("DOMContentLoaded", function () {
  const quoteElement = document.getElementById("quote");
  const videoElement = document.getElementById("video");

  // Zufälliges Zitat anzeigen
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = randomQuote;

  // Zufälliges Video anzeigen und automatisch abspielen
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  videoElement.src = randomVideo;
});
