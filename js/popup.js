// Constant Variables
const introSection = document.querySelector('#intro-section');
const loadingSection = document.querySelector('#loading-section');
const buttonSection = document.querySelector('#button-section');
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const previewCountAlert = document.querySelector('#preview-count');
const publishCountAlert = document.querySelector('#publish-count');
const urlAlert = document.querySelector('#url-alert');
let vanityURL = false;
let currentSite = "";
let pageLoaded = false;
let activeTab;
let commsPort;

// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    console.log(activeTabURL);
    csConnect("connect", "");
    if (activeTabURL.startsWith('https://tbadmin.radancy.net/redirects/vanitysearchurls/')){
        urlAlert.innerHTML = ``;
        loadingSection.removeAttribute('hidden');
        vanityURL = true;
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

function csConnect(type, content){
    let port;
    if (type == "connect"){
        port = chrome.tabs.connect(activeTab.id, { name: "content_connect" } )
        commsPort = port;
        port.postMessage({message: "started"});
    }
    if (type == "message"){
        port.postMessage({message: content})
    }
    port.onMessage.addListener((msg) => {
        if (msg){
            if (msg.message === "page load" ){
                console.log("received page load message")
                pageLoaded = true;
                introSection.removeAttribute('hidden');
                buttonSection.removeAttribute('hidden');
                loadingSection.setAttribute('hidden', '');
                port.postMessage({ message: "vanity page loaded" })
            }
            if (msg.url){
                console.log(msg);
                currentSite = msg.url;
                updateURLAlert(vanityURL, currentSite);
                updateCount(msg.previewCount, msg.publishCount);
            }
        }
    })
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

function btnEvents(){
    previewBtn.addEventListener('click', () => {
        commsPort.postMessage({ message: "preview all" });
    })
    publishBtn.addEventListener('click', () => {
        commsPort.postMessage({ message: "publish all" });
    })
}

function main(){
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
}

main();