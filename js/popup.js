const LangMap = {
    all: "All Languages",
    en: "English",
    fr: "French",
    de: "German",
    es: "Spanish",
    ptBr: "Portuguese (Brazil)",
    zhHans: "Chinese (Simplified)",
    ja: "Japanese",
    zhHant: "Chinese (Traditional)",
    frCa: "French Canadian",
    it: "Italian",
    sv: "Swedish",
    nl: "Dutch",
    ru: "Russian",
    hu: "Hungarian",
    cs: "Czech",
    pl: "Polish",
    ar: "Arabic",
    da: "Danish",
    ko: "Korean",
    lv: "Latvian",
    lt: "Lithuanian",
    is: "Icelandic",
    sr: "Serbian",
    sk: "Slovak",
    ro: "Romanian",
    fi: "Finnish",
    no: "Norwegian",
    hr: "Croatian",
    sl: "Slovenian",
    et: "Estonian",
    vi: "Vietnamese",
    uk: "Ukrainian",
    th: "Thai",
    ms: "Malay",
    he: "Hebrew",
    enGb: "English (Great Britain)",
};
class VanityUrlLists {
    constructor(list) {
        this.allList = list;
        console.log(this.allList);
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
        this.isList = VanityUrlLists.FilterByLang(list, "is");
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
    static FilterByPreview(list) {
        return list.filter((el) => el.onStage == false);
    }
    static FilterByPublish(list) {
        return list.filter((el) => el.onProd == false);
    }
}
class VanityUrl {
    constructor(url, stageBtn, prodBtn, lang, id) {
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.IsPublished(stageBtn);
        this.prodBtn = prodBtn;
        this.onProd = VanityUrl.IsPublished(prodBtn);
        this.lang = lang;
        this.id = id;
    }
    static IsPublished(node) {
        let text = node.innerText.toLowerCase();
        if (text == "publish") {
            return false;
        }
        return true;
    }
}
let vuLists;
var STATE;
(function (STATE) {
    STATE["LOADING"] = "loading";
    STATE["READY"] = "ready";
    STATE["WORKING"] = "working";
    STATE["INACTIVE"] = "inactive";
})(STATE || (STATE = {}));
class StateMachine {
    static get current() {
        return this.currentState;
    }
    static set current(state) {
        this.UpdateState(state);
        this.currentState = state;
        console.log(StateMachine.current);
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
            console.log(list);
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
        }
    }
    static UpdateContent(state) {
        switch (state) {
            case STATE.LOADING:
                this.HideElement(urlAlert, previewCountAlert, publishCountAlert);
                this.IsAdminPage(false);
                break;
            case STATE.READY:
                this.ShowElement(urlAlert, previewCountAlert, publishCountAlert);
                this.IsAdminPage(true);
                this.UpdateURLCount(previewCountNum, previewCount.toString());
                this.UpdateURLCount(publishCountNum, publishCount.toString());
                break;
            case STATE.WORKING:
                this.ShowElement(urlAlert, previewCountAlert, publishCountAlert);
                this.IsAdminPage(true);
                this.UpdateURLCount(previewCountNum, previewCount.toString());
                this.UpdateURLCount(publishCountNum, publishCount.toString());
                break;
            case STATE.INACTIVE:
                this.ShowElement(urlAlert);
                this.IsAdminPage(false);
                this.HideElement(previewCountAlert, publishCountAlert);
                break;
            default:
                break;
        }
    }
    static UpdateActions(state) {
        switch (state) {
            case STATE.LOADING:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect, downloadBtn);
                break;
            case STATE.READY:
                this.EnableElement(previewBtn, publishBtn, langSelect, downloadBtn);
                this.DisableElement(cancelBtn);
                break;
            case STATE.WORKING:
                this.DisableElement(previewBtn, publishBtn, langSelect, downloadBtn);
                this.EnableElement(cancelBtn);
                break;
            case STATE.INACTIVE:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect, downloadBtn);
                break;
            default:
                break;
        }
    }
    static UpdateSections(state) {
        console.log(state);
        switch (state) {
            case STATE.LOADING:
                this.HideElement(langSection, introSection, buttonSection, downloadSection);
                this.ShowElement(loadingSection);
                break;
            case STATE.READY:
                this.ShowElement(langSection, introSection, buttonSection, downloadSection);
                this.HideElement(loadingSection);
                break;
            case STATE.WORKING:
                this.ShowElement(langSection, introSection, buttonSection, downloadSection);
                this.HideElement(loadingSection);
                break;
            case STATE.INACTIVE:
                this.HideElement(langSection, introSection, buttonSection, loadingSection, downloadSection);
                break;
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
                console.log(list);
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
        if (vuLists.allList) {
            let json = JSON.stringify(vuLists.allList);
            let blob = new Blob([json], { type: "octect/stream" });
            let url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "export.json";
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
// Popup DOM Variables
const introSection = document.querySelector('#intro-section');
const loadingSection = document.querySelector('#loading-section');
const buttonSection = document.querySelector('#button-section');
const langSection = document.querySelector('#lang-select-section');
const langSelect = document.querySelector('#lang-select-list');
const downloadSection = document.querySelector('#download-section');
const downloadBtn = document.querySelector('#download-section__button');
const downloadLink = document.querySelector('#download-link');
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
// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    console.log(activeTabURL);
    csConnect("connect", "");
    if (activeTabURL.startsWith(tbUS) || activeTabURL.startsWith(tbEU)) {
        StateMachine.current = STATE.LOADING;
        console.log(StateMachine.current);
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
                console.log(msg);
                currentSite = msg.url;
                StateMachine.current = STATE.READY;
                previewCount = msg.previewCount;
                publishCount = msg.publishCount;
                vuLists = msg.vuLists;
                StateMachine.UpdateData();
                console.log('All VU Lists');
                console.log(msg.vuLists);
                VanityActions.CheckOngoingActions();
                VanityActions.SetDownload();
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
}
function main() {
    StateMachine.current = STATE.INACTIVE;
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
}
main();
// export {};
//# sourceMappingURL=popup.js.map