// Regex variables
const urlRegex = /\((.*?)\)/gm

// Functional variables
let currentSite; // Careers site that the vanity management page affects
let vanityPageLoaded = false; // Vanity management page fully loaded
let previewBtns; // Array of all preview button DOM elements
let publishBtns; // Array of all publish button DOM elements
let commsPort; // Port to talk to the popup script
let tabID; // ID of current tab

chrome.runtime.onConnect.addListener((port) => {
    commsPort = port;
    console.log(port);
    console.assert(port.name === "content_connect");
    port.onMessage.addListener((msg) => {
        if (msg){
            if ( msg.message == "started" ){
                tabID = msg.tabid;
                console.log(tabID);
                if (document.readyState === "complete"){
                    port.postMessage({message: "page load"});
                }
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

window.addEventListener('load', () => {
    console.log('page loaded');
    if (commsPort != undefined){
        commsPort.postMessage({message: "page load"});
    }
});