document.addEventListener("DOMContentLoaded", function () {
  loadSettings();
  loadBlockedSites();
  // loadMotivationalQuotes();
  // loadMotivationalVideos();

  document.getElementById("addSite").addEventListener("click", addSite);
  document
    .getElementById("clearAllSites")
    .addEventListener("click", clearAllSites);
  document
    .getElementById("exportSites")
    .addEventListener("click", exportBlockedSites);
  document
    .getElementById("importSites")
    .addEventListener("click", () =>
      document.getElementById("importFile").click()
    );
  document
    .getElementById("importFile")
    .addEventListener("change", importBlockedSites);
  document
    .getElementById("saveSettings")
    .addEventListener("click", saveSettings);
});

function loadSettings() {
  chrome.storage.sync.get(
    ["motivationalQuotes", "motivationalVideos"],
    function (result) {
      document.getElementById("motivationalQuotes").value =
        result.motivationalQuotes || "";
      document.getElementById("motivationalVideos").value =
        result.motivationalVideos || "";
    }
  );
}

function saveSettings() {
  const motivationalQuotes =
    document.getElementById("motivationalQuotes").value;
  const motivationalVideos =
    document.getElementById("motivationalVideos").value;
  chrome.storage.sync.set(
    {
      motivationalQuotes: motivationalQuotes,
      motivationalVideos: motivationalVideos,
    },
    function () {
      showMessage("Settings saved successfully!", "success");
    }
  );
}

function addSite() {
  let site = document.getElementById("siteInput").value;
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

function deleteSite(index) {
  chrome.storage.sync.get("blockedSites", function (result) {
    let blockedSites = result.blockedSites || [];
    blockedSites.splice(index, 1);
    chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
      loadBlockedSites();
    });
  });
  showMessage("Site was deleted", "success");
}

function clearAllSites() {
  chrome.storage.sync.set({ blockedSites: [] }, function () {
    loadBlockedSites();
  });
  showMessage("Cleared all sites", "success");
}

function showMessage(text, type) {
  let messageDiv = document.getElementById("message");
  messageDiv.textContent = text;
  messageDiv.className = type;
  setTimeout(() => {
    messageDiv.textContent = "";
    messageDiv.className = "";
  }, 3000);
}

function exportBlockedSites() {
  chrome.storage.sync.get("blockedSites", function (result) {
    const blockedSites = result.blockedSites || [];
    const blob = new Blob([JSON.stringify(blockedSites)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blocked_sites.json";
    a.click();
  });
}

function importBlockedSites(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedSites = JSON.parse(e.target.result);
        if (Array.isArray(importedSites)) {
          chrome.storage.sync.get("blockedSites", function (result) {
            let currentBlockedSites = result.blockedSites || [];

            // Füge nur neue Seiten hinzu, die noch nicht in der Liste sind
            const newBlockedSites = importedSites.filter(
              (site) => !currentBlockedSites.includes(site)
            );
            const updatedBlockedSites = [
              ...currentBlockedSites,
              ...newBlockedSites,
            ];

            chrome.storage.sync.set(
              { blockedSites: updatedBlockedSites },
              function () {
                loadBlockedSites(); // Aktualisiere die angezeigte Liste
                alert(
                  `Import erfolgreich! ${newBlockedSites.length} neue Seite(n) hinzugefügt.`
                );
              }
            );
          });
        } else {
          throw new Error("Ungültiges Format");
        }
      } catch (error) {
        alert(
          "Fehler beim Importieren der blockierten Seiten. Bitte stellen Sie sicher, dass die Datei im korrekten Format vorliegt."
        );
      }
    };
    reader.readAsText(file);
  }
}

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
