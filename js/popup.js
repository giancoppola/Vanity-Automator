// Constant Variables
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const previewCountAlert = document.querySelector('#preview-count');
const publishCountAlert = document.querySelector('#publish-count');
const urlAlert = document.querySelector('#url-alert');

// gathers information on the currently active tab
function logTabs(tabs) {
    let activeTab = tabs[0].url;
    let currentSite;
    console.log(activeTab);
    let vanityURL = false;
    if (activeTab.startsWith('https://tbadmin.radancy.net/redirects/vanitysearchurls/')){
        vanityURL = true;
    }
    if (vanityURL == true){
        chrome.runtime
            .sendMessage(activeTab)
            .then((response) => {
                console.log("Response from the content script:");
                console.log(response.response);
                currentSite = response.response;
            })
            .catch(onError);
    }
    updateURLAlert(vanityURL);
  }

function onError(error) {
    console.error(`Error: ${error}`);
}

// updates the text at the bottom of the popup to show whether you are on the right URL or not
function updateURLAlert(status){
    if (status == true){
        urlAlert.innerHTML = "You are on a Vanity URL page";
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

chrome.tabs
    .query({ currentWindow: true, active: true })
    .then(logTabs, onError);