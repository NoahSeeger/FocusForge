document.addEventListener("DOMContentLoaded", function () {
  Promise.all([loadMotivationalQuotes(), loadMotivationalVideos()]).then(
    ([quotes, videos]) => {
      const quoteElement = document.getElementById("quote");
      const videoElement = document.getElementById("video");

      // Zufälliges Zitat anzeigen
      if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
      } else {
        quoteElement.textContent = "No motivational quotes available.";
      }

      // Zufälliges Video anzeigen und automatisch abspielen
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      videoElement.src = randomVideo;
    }
  );
});

function loadMotivationalQuotes() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("motivationalQuotes", function (result) {
      let motivationalQuotes = result.motivationalQuotes || "";
      let quotes = motivationalQuotes
        .split("\n")
        .filter((quote) => quote.trim() !== "");
      resolve(quotes);
    });
  });
}

function loadMotivationalVideos() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("motivationalVideos", function (result) {
      let motivationalVideos = result.motivationalVideos || "";
      let videos = motivationalVideos
        .split("\n")
        .filter((video) => video.trim() !== "")
        .map((video) => convertYouTubeLinkToEmbed(video));
      resolve(videos);
    });
  });
}

function convertYouTubeLinkToEmbed(link) {
  const url = new URL(link);
  let videoId;

  if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else if (url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/embed/")[1];
    } else if (url.pathname.startsWith("/v/")) {
      videoId = url.pathname.split("/v/")[1];
    }
  } else if (url.hostname === "youtu.be") {
    videoId = url.pathname.split("/")[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
  } else {
    return null;
  }
}
