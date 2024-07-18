chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(
    ["blockedSites", "blockingEnabled"],
    function (result) {
      if (!result.blockedSites) {
        chrome.storage.sync.set({ blockedSites: [] });
      }
      if (result.blockingEnabled === undefined) {
        chrome.storage.sync.set({ blockingEnabled: true });
      }
    }
  );
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only handle main frame navigation

  chrome.storage.sync.get(
    ["blockingEnabled", "blockedSites"],
    function (result) {
      if (!result.blockingEnabled) return; // If blocking is disabled, allow navigation

      const url = new URL(details.url);
      const blockedSites = result.blockedSites || [];

      if (blockedSites.some((site) => url.hostname.includes(site))) {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("motivation.html"),
        });
      }
    }
  );
});
