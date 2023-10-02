const urlRegex = /\((.*?)\)/gm

chrome.runtime.onMessage.addListener((request) => {
    console.log("Message from the background script:");
    console.log(request.message);
    const currentSite = document.querySelector('.search-drop').innerHTML;
    currentSite = urlRegex.exec(currentSite);
    return Promise.resolve({ response: currentSite[1] });
  });