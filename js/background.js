chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.startsWith("https://tbadmin.radancy.net/redirects/vanitysearchurls/")) {
        console.log(tab.url)
        console.log("firing");
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);

        chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
        url: tab.url
        });
    }
});