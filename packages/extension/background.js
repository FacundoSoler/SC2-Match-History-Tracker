chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchSC2Data") {

    try {
      const gameData = fetch("http://localhost:6119/game")
        .then((response) => response.json());

      const UIdata = fetch("http://localhost:6119/ui")
        .then((response) => response.json());

      const mappedUIdata = Object.fromEntries(
        UIdata.activeScreens.map(screen => [screen, true])
      );

      const mappedData = {
        gameData: gameData,
        UIdata: mappedUIdata
      };

      sendResponse({ success: true, mappedData });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }

    return true;
  }
});