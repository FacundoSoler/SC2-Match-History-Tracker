window.addEventListener("message", (event) => {
  console.log('Content Script message listened');
  // Only handle messages meant for our extension
  if (!event.data || event.data.type !== "REQUEST_SC2_DATA") return;

  const customParam = event.data.customParam;

  // Forward to the background script
  chrome.runtime.sendMessage({ 
    action: "fetchSC2Data",
    customParam: customParam
  }, (response) => {
    // Send the background response back to the Vue app
    window.postMessage({ type: "RECEIVE_SC2_DATA", payload: response }, "*");
  });
});