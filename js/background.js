let url;

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
});

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab){
        url = changeInfo.url;
    }
);
export {url};