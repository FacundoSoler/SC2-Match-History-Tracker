window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data || !event.data.type) return;

  const customParam = event.data.customParam;

  if (event.data.type === "CHECK_EXTENSION_INSTALL") {
    window.postMessage({ type: "EXTENSION_CONFIRM_INSTALL" }, "*");
    try {
      chrome.runtime.sendMessage({ action: 'checkForUpdate' });
    } catch (error) {
      console.warn("[SC2 Extension] Context lost while checking for update:", error);
    }
    return;
  }

  if (event.data.type === "REQUEST_SC2_DATA") {
    if (!chrome.runtime?.id) {
      console.warn("[SC2 Extension] Extension context invalidated. Please refresh the page.");
      return;
    }

    try {
      chrome.runtime.sendMessage({
        action: "fetchSC2Data",
        customParam: customParam
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("[SC2 Extension] Message error:", chrome.runtime.lastError.message);
          return;
        }

        window.postMessage({ type: "RECEIVE_SC2_DATA", payload: response }, "*");
      });
    } catch (error) {
      console.warn("[SC2 Extension] Context lost while sending message:", error);
    }
  }
});