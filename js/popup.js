// Constant Variables
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const previewCountAlert = document.querySelector('#preview-count');
const publishCountAlert = document.querySelector('#publish-count');
const urlAlert = document.querySelector('#url-alert');
let vanityURL = false;
let currentSite = "";
let pageLoaded = false;
let activeTab;

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.page_load){
        if (request.page_load === "true") {
            console.log("received page load message")
            pageLoaded = true;
            if ( vanityURL == true && pageLoaded == true ){
                sendMessage(activeTab.id, "VanityPageLoaded");
            }
        }
    }
});

// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    console.log(activeTabURL);
    sendMessage(activeTab.id, "Started");
    if (activeTabURL.startsWith('https://tbadmin.radancy.net/redirects/vanitysearchurls/')){
        vanityURL = true;
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

function sendMessage(tab, type){
    if ( type == "Started" ){
        chrome.tabs
            .sendMessage(tab, { message: "Started" })
            .then((response) => {
                console.log("Response from the content script:");
                console.log(response)
                console.log(response.message);
            })
            .catch(onError);
    }
    if (type == "VanityPageLoaded"){
        chrome.tabs
            .sendMessage(tab, { message: "VanityPageLoaded" })
            .then((response) => {
                console.log("Response from the content script:");
                console.log(response);
                currentSite = response.message;
                updateURLAlert(vanityURL, currentSite);
            })
            .catch(onError);
    }
}

// updates the text at the bottom of the popup to show whether you are on the right URL or not
function updateURLAlert(status, currentSite){
    if (status == true){
        urlAlert.innerHTML = `You are on the Vanity URL page for ${currentSite}`;
        urlAlert.style.color = "green";
        previewBtn.removeAttribute("disabled");
        publishBtn.removeAttribute("disabled");
    }
    else {
        urlAlert.innerHTML = "You are not on a Vanity URL page";
        urlAlert.style.color = "red";
        previewBtn.setAttribute("disabled", "");
        publishBtn.setAttribute("disabled", "");
    }
}

// updates the text below each button to show how many URLs are able to be pushed
function updateCount(previewCount, publishCount){
    previewCountAlert.innerHTML = `There are ${previewCount} URLs to Preview`;
    publishCountAlert.innerHTML = `There are ${publishCount} URLs to Publish`;
}

function main(){
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
}

main();