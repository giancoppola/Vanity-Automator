const urlRegex = /\((.*?)\)/gm
let pageLoad = false;
let vanityPageLoaded = false;

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    console.log("Message from the popup script:");
    if (request.message){
        console.log(request.message);
        if ( request.message == "Started" && pageLoad == false ){
            if ( document.readyState === "complete") {
                console.log("page loaded")
                pageLoaded();
            };
            sendResponse({ message: "onload event added" });
        }
        if ( request.message == "VanityPageLoaded" ){
            let currentSite = document.querySelector('.search-drop').innerHTML;
            currentSite = urlRegex.exec(currentSite);
            currentSite = currentSite[1];
            sendResponse({ message: currentSite });
        }
        if ( request.message == "Started" && pageLoad == true && vanityPageLoaded == true){
            let currentSite = document.querySelector('.search-drop').innerHTML;
            currentSite = urlRegex.exec(currentSite);
            currentSite = currentSite[1];
            sendResponse({ message: currentSite });
        }
    }
});

function sendMessage(type) {
    console.log('cs sending message');
    if ( type == "PageLoad" ){
        chrome.runtime
            .sendMessage( { page_load: "true" })
            .then(() => {
                console.log("page load message sent from cs");
            })
            .catch(onError);
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

function pageLoaded(){
    pageLoad = true;
    sendMessage("PageLoad");
}