import { LangMap, VanityUrlLists, JsonReader } from "../js/types.js";
// Popup DOM Variables
const introSection = document.querySelector('#intro-section');
const loadingSection = document.querySelector('#loading-section');
const buttonSection = document.querySelector('#button-section');
const langSection = document.querySelector('#lang-select-section');
const langSelect = document.querySelector('#lang-select-list');
const downloadSection = document.querySelector('#download-section');
const downloadBtn = document.querySelector('#download-section__button');
const downloadLink = document.querySelector('#download-link');
const uploadSection = document.querySelector('#upload-section');
const uploadBtn = document.querySelector('#upload-section__button');
const uploadText = document.querySelector('#upload-text');
const uploadInfo = document.querySelector('#upload-info-container');
const uploadCount = document.querySelector('#upload-count');
const uploadLangSelect = document.querySelector("#upload-lang-select-list");
const uploadBeginBtn = document.querySelector("#add-urls__button");
const uploadRestrict = document.querySelector("#upload-restrict");
const uploadRestrictDisplay = document.querySelector("#upload-restrict-display");
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const cancelBtn = document.querySelector('#cancel-section__button');
const previewCountAlert = document.querySelector('#preview-count');
const previewCountNum = document.querySelector('#preview-count-num');
const publishCountAlert = document.querySelector('#publish-count');
const publishCountNum = document.querySelector('#publish-count-num');
const cancelText = document.querySelector('#cancel-text');
const urlAlert = document.querySelector('#url-alert');
// URL Variables
const tbUS = "https://tbadmin.radancy.net/redirects/vanitysearchurls/"; // US Admin string
const tbEU = "https://tbadmin.radancy.eu/redirects/vanitysearchurls/"; // EU Admin string
// Functional variables
let currentSite = ""; // Site the vanity management page affects
let pageLoaded = false; // Is the vanity management page fully loaded
let activeTab; // Object containing information about the active tab
let commsPort; // Communication port for content script comms
let previewCount = 0; // How many URLs are ready for preview
let publishCount = 0; // How many URLs are ready for publish
let selectedLang = "all"; // Currently selected language
let isLegacy = false;
let legacyJSON = "";
let vuLists;
let importObj;
var STATE;
(function (STATE) {
    STATE["LOADING"] = "loading";
    STATE["READY"] = "ready";
    STATE["WORKING"] = "working";
    STATE["INACTIVE"] = "inactive";
    STATE["LEGACY"] = "legacy";
    STATE["IMPORTED"] = "imported";
})(STATE || (STATE = {}));
class StateMachine {
    static get current() {
        return this.currentState;
    }
    static set current(state) {
        this.UpdateState(state);
        this.currentState = state;
    }
    static UpdateState(state) {
        this.UpdateData();
        this.UpdateSections(state);
        this.UpdateContent(state);
        this.UpdateActions(state);
    }
    static UpdateData() {
        if (vuLists != null) {
            this.AddLanguage();
            let list = selectedLang + "List";
            let previewList;
            let publishList;
            previewList = VanityUrlLists.FilterByPreview(vuLists[list]);
            publishList = VanityUrlLists.FilterByPublish(vuLists[list]);
            previewCount = previewList.length;
            publishCount = publishList.length;
            this.UpdateURLCount(previewCountNum, previewCount.toString());
            this.UpdateURLCount(publishCountNum, publishCount.toString());
            previewCount <= 0 ? this.DisableElement(previewBtn) : this.EnableElement(previewBtn);
            publishCount <= 0 ? this.DisableElement(publishBtn) : this.EnableElement(publishBtn);
            VanityActions.SetDownload();
        }
    }
    static UpdateContent(state) {
        switch (state) {
            case STATE.LOADING:
                this.HideElement(urlAlert, previewCountAlert, publishCountAlert, uploadInfo);
                this.IsAdminPage(false);
                break;
            case STATE.READY:
                this.HideElement(uploadInfo);
                this.ShowElement(urlAlert, previewCountAlert, publishCountAlert);
                this.IsAdminPage(true);
                this.UpdateURLCount(previewCountNum, previewCount.toString());
                this.UpdateURLCount(publishCountNum, publishCount.toString());
                break;
            case STATE.WORKING:
                this.HideElement(uploadInfo);
                this.ShowElement(urlAlert, previewCountAlert, publishCountAlert);
                this.IsAdminPage(true);
                this.UpdateURLCount(previewCountNum, previewCount.toString());
                this.UpdateURLCount(publishCountNum, publishCount.toString());
                break;
            case STATE.INACTIVE:
                this.ShowElement(urlAlert);
                this.IsAdminPage(false);
                this.HideElement(previewCountAlert, publishCountAlert, uploadInfo);
                break;
            case STATE.LEGACY:
                this.ShowElement(urlAlert);
                this.IsAdminPage(false);
                this.HideElement(previewCountAlert, publishCountAlert, uploadInfo);
                break;
            case STATE.IMPORTED:
                this.HideElement(urlAlert, previewCountAlert, publishCountAlert);
                this.ShowElement(uploadInfo);
            default:
                break;
        }
    }
    static UpdateActions(state) {
        switch (state) {
            case STATE.LOADING:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect, downloadBtn, uploadBtn);
                break;
            case STATE.READY:
                this.EnableElement(previewBtn, publishBtn, langSelect, downloadBtn, uploadBtn);
                this.DisableElement(cancelBtn);
                break;
            case STATE.WORKING:
                this.DisableElement(previewBtn, publishBtn, langSelect, downloadBtn, uploadBtn);
                this.EnableElement(cancelBtn);
                break;
            case STATE.INACTIVE:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect, downloadBtn, uploadBtn);
                break;
            case STATE.LEGACY:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect, uploadBtn);
                this.EnableElement(downloadBtn);
                break;
            case STATE.IMPORTED:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect, downloadBtn);
                this.EnableElement(uploadBtn);
            default:
                break;
        }
    }
    static UpdateSections(state) {
        switch (state) {
            case STATE.LOADING:
                this.HideElement(langSection, introSection, buttonSection, downloadSection, uploadSection);
                this.ShowElement(loadingSection);
                break;
            case STATE.READY:
                this.ShowElement(langSection, introSection, buttonSection, downloadSection, uploadSection);
                this.HideElement(loadingSection);
                break;
            case STATE.WORKING:
                this.ShowElement(langSection, introSection, buttonSection, downloadSection, uploadSection);
                this.HideElement(loadingSection);
                break;
            case STATE.INACTIVE:
                this.HideElement(langSection, introSection, buttonSection, loadingSection, downloadSection, uploadSection);
                break;
            case STATE.LEGACY:
                this.HideElement(langSection, introSection, loadingSection, buttonSection, uploadSection);
                this.ShowElement(downloadSection);
                break;
            case STATE.IMPORTED:
                this.HideElement(langSection, introSection, loadingSection, buttonSection, uploadSection, downloadSection);
                this.ShowElement(uploadSection);
            default:
                break;
        }
    }
    static HideElement(...nodes) {
        for (let node of nodes) {
            node.setAttribute('hidden', '');
        }
    }
    static ShowElement(...nodes) {
        for (let node of nodes) {
            node.removeAttribute('hidden');
        }
    }
    static DisableElement(...nodes) {
        for (let node of nodes) {
            node.setAttribute("disabled", "");
        }
    }
    static EnableElement(...nodes) {
        for (let node of nodes) {
            node.removeAttribute("disabled");
        }
    }
    static IsAdminPage(adminPage) {
        if (adminPage) {
            urlAlert.innerHTML = `You are on the Vanity URL page for ${currentSite}`;
            urlAlert.style.color = "green";
        }
        else if (isLegacy) {
            urlAlert.innerHTML = 'You are on a Legacy Vanity URL page, you will only \
            be able to export URLs to JSON format.';
            urlAlert.style.color = "orange";
            document.querySelector('#download-section__text')
                .innerText = "Export legacy URLs on page to JSON format";
        }
        else {
            urlAlert.innerHTML = "You are not on a Vanity URL page";
            urlAlert.style.color = "red";
        }
    }
    static UpdateURLCount(node, count) {
        node.innerText = count;
    }
    static AddLanguage() {
        if (langSelect) {
            for (var lang in LangMap) {
                let list = vuLists[lang + "List"];
                if (list.length > 0 && !langSelect.namedItem(lang)) {
                    let opt = document.createElement("option");
                    opt.setAttribute("id", lang);
                    opt.value = lang;
                    opt.text = LangMap[lang];
                    langSelect.add(opt);
                }
            }
        }
    }
}
StateMachine.currentState = STATE.INACTIVE;
class VanityActions {
    static CheckOngoingActions() {
        if (localStorage.getItem("vanityAction") == "true") {
            if (localStorage.getItem('vanityURL') == currentSite) {
                let lang = localStorage.getItem('vanityLanguage') ? localStorage.getItem('vanityLanguage') : "";
                if (localStorage.getItem('vanityPreview') == "true") {
                    if (previewCount > 0 && lang) {
                        langSelect.value = lang;
                        StateMachine.UpdateData();
                        this.ActionVanities("Preview", lang);
                    }
                    else {
                        this.CancelAll();
                    }
                }
                if (localStorage.getItem('vanityPublish') == "true") {
                    if (publishCount > 0 && lang) {
                        langSelect.value = lang;
                        StateMachine.UpdateData();
                        this.ActionVanities("Publish", lang);
                    }
                    else {
                        this.CancelAll();
                    }
                }
            }
        }
    }
    static ActionVanities(action, lang) {
        StateMachine.current = STATE.WORKING;
        let listId = lang + "List";
        let list = action == "Preview" ? VanityUrlLists.FilterByPreview(vuLists[listId]) : VanityUrlLists.FilterByPublish(vuLists[listId]);
        let id = list[0].id;
        urlAlert.innerHTML = `Currently ${action.toLowerCase()}ing ${LangMap[lang]} URLs for ${currentSite}`;
        urlAlert.style.color = 'orange';
        localStorage.setItem("vanityAction", "true");
        localStorage.setItem("vanityURL", currentSite);
        localStorage.setItem("vanityLanguage", lang);
        localStorage.setItem(("vanity" + action), 'true');
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            world: "MAIN",
            func: InjectFunc,
            args: [action, id]
        });
        setTimeout(() => {
            console.log('reloading popup');
            location.reload();
        }, 20000);
    }
    static CancelAll() {
        localStorage.removeItem("vanityAction");
        localStorage.removeItem("vanityURL");
        localStorage.removeItem('vanityLanguage');
        localStorage.removeItem('vanityPreview');
        localStorage.removeItem('vanityPublish');
        console.log('local storage cleared');
        console.log(localStorage);
        cancelText.innerHTML = 'Ongoing actions have been cancelled!';
    }
    static SetDownload() {
        if (isLegacy) {
            let blob = new Blob([legacyJSON], { type: "octect/stream" });
            let url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "legacy_vanity-export.json";
        }
        else if (vuLists) {
            let json = JSON.stringify(vuLists[selectedLang + "List"], null, "\t");
            let blob = new Blob([json], { type: "octect/stream" });
            let url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = LangMap[selectedLang] + "_vanity-export.json";
        }
    }
    static SetUpload(str) {
        importObj = str;
        uploadCount.innerText = JSON.parse(importObj).length.toString();
        StateMachine.current = STATE.IMPORTED;
        port.postMessage({ message: "import", importObj: importObj });
    }
    static SetUploadLang(langList) {
        for (let opt of langList) {
            let lang = document.createElement("option");
            lang.text = opt[0];
            lang.value = opt[1];
            uploadLangSelect.add(lang);
        }
    }
}
function InjectFunc(action, id) {
    action = action.toLowerCase();
    const input = document.querySelector(`input[value="${id}"]`);
    const parent = input.closest('li');
    const btn = parent.querySelector(`button.add-list-${action}`);
    console.log('starting inject');
    window.confirm = function () {
        return true;
    };
    btn.click();
    console.log('finished inject');
}
// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    csConnect("connect", "");
    if (activeTabURL.startsWith(tbUS) || activeTabURL.startsWith(tbEU)) {
        StateMachine.current = STATE.LOADING;
    }
}
function onError(error) {
    console.error(`Error: ${error}`);
}
let port;
function csConnect(type, content) {
    if (type == "connect") {
        port = chrome.tabs.connect(activeTab.id, { name: "content_connect" });
        commsPort = port;
        port.postMessage({ message: "started", tabid: activeTab.id });
        AddUIEvents();
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
                currentSite = msg.url;
                StateMachine.current = STATE.READY;
                previewCount = msg.previewCount;
                publishCount = msg.publishCount;
                vuLists = msg.vuLists;
                isLegacy = msg.isLegacy;
                legacyJSON = msg.legacyJSON;
                if (isLegacy) {
                    StateMachine.current = STATE.LEGACY;
                }
                ;
                StateMachine.UpdateData();
                VanityActions.CheckOngoingActions();
                VanityActions.SetDownload();
            }
            if (msg.message === "uploadLangList") {
                VanityActions.SetUploadLang(msg.langList);
            }
        }
    });
}
function AddUIEvents() {
    previewBtn.addEventListener('click', () => {
        VanityActions.ActionVanities("Preview", selectedLang);
    });
    publishBtn.addEventListener('click', () => {
        VanityActions.ActionVanities("Publish", selectedLang);
    });
    cancelBtn.addEventListener('click', () => {
        VanityActions.CancelAll();
    });
    langSelect.addEventListener('change', (event) => {
        selectedLang = event.target.value;
        StateMachine.UpdateData();
    });
    uploadBtn.onchange = (e) => {
        // if ((e.target as HTMLInputElement).files[0].type == )
        if (e.target.files[0].type == "application/json") {
            uploadText.innerText = "";
            JsonReader.ImportJson(e.target.files[0])
                .then((str) => {
                VanityActions.SetUpload(str);
            });
        }
        else {
            StateMachine.HideElement(uploadInfo);
            uploadText.innerText = "Please upload a JSON file.";
        }
    };
    uploadBeginBtn.addEventListener('click', () => {
        let lang = uploadLangSelect.value;
        port.postMessage({ message: "add", lang: lang, restrict: uploadRestrict.value });
    });
    uploadRestrict.onchange = (e) => {
        console.log("firing?");
        uploadRestrictDisplay.innerText = e.target.value;
    };
}
function main() {
    StateMachine.current = STATE.INACTIVE;
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
}
main();
//# sourceMappingURL=popup.js.map