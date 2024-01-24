class VanityUrlLists {
    constructor(list) {
        this.fullList = list;
        console.log(this.fullList);
        this.enList = VanityUrlLists.FilterByLang(list, "en");
        this.frList = VanityUrlLists.FilterByLang(list, "fr");
        this.deList = VanityUrlLists.FilterByLang(list, "de");
        this.esList = VanityUrlLists.FilterByLang(list, "es");
        this.ptBrList = VanityUrlLists.FilterByLang(list, "pt-br");
        this.zhHansList = VanityUrlLists.FilterByLang(list, "zh-hans");
        this.jaList = VanityUrlLists.FilterByLang(list, "ja");
        this.zhHantList = VanityUrlLists.FilterByLang(list, "zh-hant");
        this.frCaList = VanityUrlLists.FilterByLang(list, "fr-ca");
        this.itList = VanityUrlLists.FilterByLang(list, "it");
        this.svList = VanityUrlLists.FilterByLang(list, "sv");
        this.nlList = VanityUrlLists.FilterByLang(list, "nl");
        this.ruList = VanityUrlLists.FilterByLang(list, "ru");
        this.huList = VanityUrlLists.FilterByLang(list, "hu");
        this.huList = VanityUrlLists.FilterByLang(list, "hu");
        this.csList = VanityUrlLists.FilterByLang(list, "cs");
        this.plList = VanityUrlLists.FilterByLang(list, "pl");
        this.arList = VanityUrlLists.FilterByLang(list, "ar");
        this.daList = VanityUrlLists.FilterByLang(list, "da");
        this.koList = VanityUrlLists.FilterByLang(list, "ko");
        this.lvList = VanityUrlLists.FilterByLang(list, "lv");
        this.ltList = VanityUrlLists.FilterByLang(list, "lt");
        this.irList = VanityUrlLists.FilterByLang(list, "ir");
        this.srList = VanityUrlLists.FilterByLang(list, "sr");
        this.skList = VanityUrlLists.FilterByLang(list, "sk");
        this.roList = VanityUrlLists.FilterByLang(list, "ro");
        this.fiList = VanityUrlLists.FilterByLang(list, "fi");
        this.noList = VanityUrlLists.FilterByLang(list, "no");
        this.hrList = VanityUrlLists.FilterByLang(list, "hr");
        this.slList = VanityUrlLists.FilterByLang(list, "sl");
        this.etList = VanityUrlLists.FilterByLang(list, "et");
        this.viList = VanityUrlLists.FilterByLang(list, "vi");
        this.ukList = VanityUrlLists.FilterByLang(list, "uk");
        this.thList = VanityUrlLists.FilterByLang(list, "th");
        this.msList = VanityUrlLists.FilterByLang(list, "ms");
        this.heList = VanityUrlLists.FilterByLang(list, "he");
        this.enGbList = VanityUrlLists.FilterByLang(list, "en-gb");
    }
    static FilterByLang(list, lang) {
        return list.filter((el) => el.lang == lang);
    }
}
let vuLists;
class VanityUrl {
    constructor(url, stageBtn, prodBtn, lang) {
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.IsPublished(stageBtn);
        this.prodBtn = prodBtn;
        this.onProd = VanityUrl.IsPublished(prodBtn);
        this.lang = lang;
    }
    static IsPublished(node) {
        let text = node.innerText.toLowerCase();
        if (text == "publish") {
            return false;
        }
        return true;
    }
}
var STATE;
(function (STATE) {
    STATE["LOADING"] = "loading";
    STATE["READY"] = "ready";
    STATE["WORKING"] = "working";
    STATE["INACTIVE"] = "inactive";
})(STATE || (STATE = {}));
class State {
    static get current() {
        return this.currentState;
    }
    static set current(state) {
        State.UpdateState(state);
        this.currentState = state;
    }
    static UpdateState(state) {
    }
}
State.currentState = STATE.LOADING;
// Popup DOM Variables
const introSection = document.querySelector('#intro-section');
const loadingSection = document.querySelector('#loading-section');
const buttonSection = document.querySelector('#button-section');
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const cancelBtn = document.querySelector('#cancel-section__button');
const previewCountAlert = document.querySelector('#preview-count');
const publishCountAlert = document.querySelector('#publish-count');
const cancelText = document.querySelector('#cancel-text');
const urlAlert = document.querySelector('#url-alert');
// URL Variables
const tbUS = "https://tbadmin.radancy.net/redirects/vanitysearchurls/"; // US Admin string
const tbEU = "https://tbadmin.radancy.eu/redirects/vanitysearchurls/"; // EU Admin string
// Functional variables
let vanityURL = false; // Are you on a vanity management page
let currentSite = ""; // Site the vanity management page affects
let pageLoaded = false; // Is the vanity management page fully loaded
let activeTab; // Object containing information about the active tab
let commsPort; // Communication port for content script comms
let previewCount; // How many URLs are ready for preview
let publishCount; // How many URLs are ready for publish
// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    console.log(activeTabURL);
    csConnect("connect", "");
    if (activeTabURL.startsWith(tbUS) || activeTabURL.startsWith(tbEU)) {
        urlAlert.innerHTML = ``;
        showSections(false, false, true);
        vanityURL = true;
    }
}
function onError(error) {
    console.error(`Error: ${error}`);
}
function csConnect(type, content) {
    let port;
    if (type == "connect") {
        port = chrome.tabs.connect(activeTab.id, { name: "content_connect" });
        commsPort = port;
        port.postMessage({ message: "started", tabid: activeTab.id });
        btnEvents();
    }
    if (type == "message") {
        port.postMessage({ message: content });
    }
    port.onMessage.addListener((msg) => {
        if (msg) {
            if (msg.message === "page load") {
                console.log("received page load message");
                pageLoaded = true;
                port.postMessage({ message: "vanity page loaded" });
            }
            if (msg.url) {
                console.log(msg);
                currentSite = msg.url;
                showSections(true, true, false);
                updateURLAlert(vanityURL, currentSite);
                updateCount(msg.previewCount, msg.publishCount);
                previewCount = msg.previewCount;
                publishCount = msg.publishCount;
                vuLists = msg.vuLists;
                console.log('All VU Lists');
                console.log(msg.vuLists);
                checkVanityAction();
            }
        }
    });
}
// controls showing or hiding the popup DOM sections
function showSections(intro, button, loading) {
    if (intro == true) {
        introSection.removeAttribute('hidden');
    }
    if (button == true) {
        buttonSection.removeAttribute('hidden');
    }
    if (loading == true) {
        loadingSection.removeAttribute('hidden');
    }
    if (intro == false) {
        introSection.setAttribute('hidden', '');
    }
    if (button == false) {
        buttonSection.setAttribute('hidden', '');
    }
    if (loading == false) {
        loadingSection.setAttribute('hidden', '');
    }
}
// updates the text at the bottom of the popup to show whether you are on the right URL or not
function updateURLAlert(status, currentSite) {
    if (status == true) {
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
function updateCount(previewCount, publishCount) {
    previewCountAlert.innerHTML = `There are ${previewCount} URLs to Preview`;
    publishCountAlert.innerHTML = `There are ${publishCount} URLs to Publish`;
}
function btnEvents() {
    previewBtn.addEventListener('click', () => {
        vanityAction("preview", "all");
    });
    publishBtn.addEventListener('click', () => {
        vanityAction("publish", "all");
    });
    cancelBtn.addEventListener('click', () => {
        cancelAll();
    });
}
function checkVanityAction() {
    if (localStorage.getItem("vanityAction") == "true") {
        if (localStorage.getItem('vanityURL') == currentSite) {
            if (localStorage.getItem('vanityPreview') == "true") {
                if (previewCount > 0) {
                    vanityAction("preview", "all");
                }
                else {
                    cancelAll();
                }
            }
            if (localStorage.getItem('vanityPublish') == "true") {
                if (publishCount > 0) {
                    vanityAction("publish", "all");
                }
                else {
                    cancelAll();
                }
            }
        }
    }
}
function vanityAction(type, category) {
    let storageType;
    let injectFile;
    if (type === "preview") {
        storageType = "vanityPreview";
        injectFile = "js/preview_inject.js";
    }
    if (type === "publish") {
        storageType = "vanityPublish";
        injectFile = "js/publish_inject.js";
    }
    previewBtn.setAttribute("disabled", "");
    publishBtn.setAttribute("disabled", "");
    urlAlert.innerHTML = `Currently ${type}ing ${category} URLs for ${currentSite}`;
    urlAlert.style.color = 'orange';
    localStorage.setItem("vanityAction", "true");
    localStorage.setItem("vanityURL", currentSite);
    localStorage.setItem(storageType, 'true');
    chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: [injectFile],
        world: "MAIN"
    });
    setTimeout(() => {
        console.log('reloading popup');
        location.reload();
    }, 20000);
}
function cancelAll() {
    localStorage.removeItem("vanityAction");
    localStorage.removeItem("vanityURL");
    localStorage.removeItem('vanityPreview');
    localStorage.removeItem('vanityPublish');
    console.log('local storage cleared');
    console.log(localStorage);
    cancelText.innerHTML = 'Ongoing actions have been cancelled!';
}
function main() {
    State.current = STATE.LOADING;
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
}
main();
// export {};
//# sourceMappingURL=popup.js.map