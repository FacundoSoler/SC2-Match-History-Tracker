chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "fetchSC2Data") {

    try {
      const gameData = await fetch("http://localhost:6119/game");
      const UIdata = await fetch("http://localhost:6119/ui");

      if (gameData && UIdata) {
        const gameDataJSON = await gameData.json();
        const UIdataJSON = await UIdata.json();

        const mappedUIdata = Object.fromEntries(
          UIdataJSON.activeScreens.map(screen => [screen, true])
        );

        let mappedData = {
          gameData: gameDataJSON,
          UIdata: {
            activeScreens: mappedUIdata
          }
        };

        sendResponse({ success: true, mappedData });
      }

    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }

    return true;
  } else if (request.action === "checkForUpdate") {

    chrome.runtime.requestUpdateCheck((status) => {
      console.log('update check', status);
    });
  }
});

chrome.runtime.onUpdateAvailable.addListener((details) => {
  chrome.runtime.reload();
})