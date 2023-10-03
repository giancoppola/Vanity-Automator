const urlRegex = /\((.*?)\)/gm
let currentSite;
let vanityPageLoaded = false;
let previewBtns;
let publishBtns;

chrome.runtime.onConnect.addListener((port) => {
    console.log("firing");
    console.log(port);
    console.assert(port.name === "content_connect");
    port.onMessage.addListener((msg) => {
        if (msg){
            if ( msg.message == "started" && document.readyState === "complete" ){
                port.postMessage({message: "page load"});
            }
            if ( msg.message == "vanity page loaded" ){
                if ( currentSite == null || currentSite == undefined ){
                    currentSite = document.querySelector('.search-drop').innerHTML;
                    currentSite = urlRegex.exec(currentSite);
                    currentSite = currentSite[1];
                }
                console.log(`cs sending url - ${currentSite}`);
                previewBtns = document.querySelectorAll('.add-list-preview');
                publishBtns = document.querySelectorAll('.add-list-publish:not([disabled])');
                port.postMessage({url: currentSite, previewCount: previewBtns.length, publishCount: publishBtns.length});
                vanityPageLoaded = true;
            }
        }
    })
})

function onError(error) {
    console.error(`Error: ${error}`);
}

function extensionOpen(){
    if ( document.readyState === "complete") {
        pageLoaded();
    }
    else {
        setTimeout(extensionOpen(), 5000);
    }
}

function pageLoaded(){
    sendMessage("PageLoad");
}