document.addEventListener("DOMContentLoaded", function () {
  loadBlockingState();
  document
    .getElementById("blockingToggle")
    .addEventListener("change", toggleBlocking);
  document
    .getElementById("addCurrentSite")
    .addEventListener("click", addCurrentSite);
});

function loadBlockingState() {
  chrome.storage.sync.get("blockingEnabled", function (result) {
    let blockingEnabled =
      result.blockingEnabled !== undefined ? result.blockingEnabled : true;
    document.getElementById("blockingToggle").checked = blockingEnabled;
    updateToggleStatus(blockingEnabled);
  });
}

function toggleBlocking() {
  let blockingEnabled = document.getElementById("blockingToggle").checked;
  chrome.storage.sync.set({ blockingEnabled: blockingEnabled }, function () {
    updateToggleStatus(blockingEnabled);
    showMessage(
      blockingEnabled ? "Blocking enabled" : "Blocking disabled",
      "success"
    );
    chrome.runtime.sendMessage({
      action: "updateBlockingState",
      state: blockingEnabled,
    });
  });
}

function updateToggleStatus(blockingEnabled) {
  document.getElementById("toggleStatus").textContent = blockingEnabled
    ? "Blocking On"
    : "Blocking Off";
}

function loadBlockedSites() {
  chrome.storage.sync.get("blockedSites", function (result) {
    let blockedSites = result.blockedSites || [];
    let list = document.getElementById("blockedSitesList");
    list.innerHTML = "";
    blockedSites.forEach(function (site, index) {
      let li = document.createElement("li");
      li.textContent = site;
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", function () {
        deleteSite(index);
      });
      li.appendChild(deleteButton);
      list.appendChild(li);
    });
  });
}

function addCurrentSite() {
  // get site the user is currently on
  let site;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = new URL(tabs[0].url);
    site = url.hostname;
  });
  chrome.storage.sync.get("blockedSites", function (result) {
    let blockedSites = result.blockedSites || [];
    if (!blockedSites.includes(site)) {
      blockedSites.push(site);
      chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
        loadBlockedSites();
      });
    }
  });
  showMessage("Site was added", "success");
}

document.getElementById("openSettings").addEventListener("click", function () {
  chrome.runtime.openOptionsPage().catch((error) => {
    console.error("Error opening options page:", error);
  });
});

function showMessage(text, type) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = text;
  messageElement.className = type;
  messageElement.classList.add("show");

  // Nachricht nach 3 Sekunden ausblenden
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 3000);
}
