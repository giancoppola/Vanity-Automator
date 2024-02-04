const LangMap: Object = {
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
}

class VanityUrlLists{
    allList: Array<VanityUrl>; enList: Array<VanityUrl>; frList: Array<VanityUrl>;
    deList: Array<VanityUrl>; esList: Array<VanityUrl>; ptBrList: Array<VanityUrl>;
    zhHansList: Array<VanityUrl>; jaList: Array<VanityUrl>; zhHantList: Array<VanityUrl>;
    frCaList: Array<VanityUrl>; itList: Array<VanityUrl>; svList: Array<VanityUrl>;
    nlList: Array<VanityUrl>; ruList: Array<VanityUrl>; huList: Array<VanityUrl>;
    csList: Array<VanityUrl>; plList: Array<VanityUrl>; arList: Array<VanityUrl>;
    daList: Array<VanityUrl>; koList: Array<VanityUrl>; lvList: Array<VanityUrl>;
    ltList: Array<VanityUrl>; isList: Array<VanityUrl>; srList: Array<VanityUrl>;
    skList: Array<VanityUrl>; roList: Array<VanityUrl>; fiList: Array<VanityUrl>;
    noList: Array<VanityUrl>; hrList: Array<VanityUrl>; slList: Array<VanityUrl>;
    etList: Array<VanityUrl>; viList: Array<VanityUrl>; ukList: Array<VanityUrl>;
    thList: Array<VanityUrl>; msList: Array<VanityUrl>; heList: Array<VanityUrl>;
    enGbList: Array<VanityUrl>;
    constructor(list: Array<VanityUrl>){
        this.allList = list;
        console.log(this.allList);
        this.enList = VanityUrlLists.FilterByLang( list, "en" );
        this.frList = VanityUrlLists.FilterByLang( list, "fr" );
        this.deList = VanityUrlLists.FilterByLang( list, "de" );
        this.esList = VanityUrlLists.FilterByLang( list, "es" );
        this.ptBrList = VanityUrlLists.FilterByLang( list, "pt-br" );
        this.zhHansList = VanityUrlLists.FilterByLang( list, "zh-hans" );
        this.jaList = VanityUrlLists.FilterByLang( list, "ja" );
        this.zhHantList = VanityUrlLists.FilterByLang( list, "zh-hant" );
        this.frCaList = VanityUrlLists.FilterByLang( list, "fr-ca" );
        this.itList = VanityUrlLists.FilterByLang( list, "it" );
        this.svList = VanityUrlLists.FilterByLang( list, "sv" );
        this.nlList = VanityUrlLists.FilterByLang( list, "nl" );
        this.ruList = VanityUrlLists.FilterByLang( list, "ru" );
        this.huList = VanityUrlLists.FilterByLang( list, "hu" );
        this.huList = VanityUrlLists.FilterByLang( list, "hu" );
        this.csList = VanityUrlLists.FilterByLang( list, "cs" );
        this.plList = VanityUrlLists.FilterByLang( list, "pl" );
        this.arList = VanityUrlLists.FilterByLang( list, "ar" );
        this.daList = VanityUrlLists.FilterByLang( list, "da" );
        this.koList = VanityUrlLists.FilterByLang( list, "ko" );
        this.lvList = VanityUrlLists.FilterByLang( list, "lv" );
        this.ltList = VanityUrlLists.FilterByLang( list, "lt" );
        this.isList = VanityUrlLists.FilterByLang( list, "is" );
        this.srList = VanityUrlLists.FilterByLang( list, "sr" );
        this.skList = VanityUrlLists.FilterByLang( list, "sk" );
        this.roList = VanityUrlLists.FilterByLang( list, "ro" );
        this.fiList = VanityUrlLists.FilterByLang( list, "fi" );
        this.noList = VanityUrlLists.FilterByLang( list, "no" );
        this.hrList = VanityUrlLists.FilterByLang( list, "hr" );
        this.slList = VanityUrlLists.FilterByLang( list, "sl" );
        this.etList = VanityUrlLists.FilterByLang( list, "et" );
        this.viList = VanityUrlLists.FilterByLang( list, "vi" );
        this.ukList = VanityUrlLists.FilterByLang( list, "uk" );
        this.thList = VanityUrlLists.FilterByLang( list, "th" );
        this.msList = VanityUrlLists.FilterByLang( list, "ms" );
        this.heList = VanityUrlLists.FilterByLang( list, "he" );
        this.enGbList = VanityUrlLists.FilterByLang( list, "en-gb" );
    }
    static FilterByLang(list: Array<VanityUrl>, lang: string){
        return list.filter((el) => el.lang == lang);
    }
    static FilterByPreview(list: Array<VanityUrl>){
        return list.filter((el) => el.onStage == false);
    }
    static FilterByPublish(list: Array<VanityUrl>){
        return list.filter((el) => el.onProd == false);
    }
}

class VanityUrl{
    url: string;
    onStage: boolean;
    stageBtn: HTMLButtonElement;
    onProd: boolean;
    prodBtn: HTMLButtonElement;
    lang: string;
    id: string;
    facets: string;
    categories: string;
    locations: string;
    constructor(url:string, stageBtn: HTMLButtonElement, prodBtn: HTMLButtonElement,
        lang: string, id: string, facets: string, categories: string, locations: string){
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.IsPublished(stageBtn);
        this.prodBtn = prodBtn;
        this.onProd = VanityUrl.IsPublished(prodBtn);
        this.lang = lang;
        this.id = id;
        this.facets = facets;
        this.categories = categories;
        this.locations = locations;
    }
    static IsPublished(node: HTMLButtonElement){
        let text: string = node.innerText.toLowerCase();
        if (text == "publish"){
            return false;
        }
        return true
    }
}

let vuLists: VanityUrlLists;

enum STATE {
    LOADING = "loading",
    READY = "ready",
    WORKING = "working",
    INACTIVE = "inactive",
    LEGACY = "legacy"
}
class StateMachine {
    private static currentState: STATE = STATE.INACTIVE;
    public static get current(){
        return this.currentState;
    }
    public static set current(state: STATE){
        this.UpdateState(state);
        this.currentState = state;
        console.log(StateMachine.current);
    }
    public static UpdateState(state: STATE){
        this.UpdateData();
        this.UpdateSections(state);
        this.UpdateContent(state);
        this.UpdateActions(state);
    }
    public static UpdateData(){
        if (vuLists != null){
            this.AddLanguage();
            let list: string = selectedLang + "List";
            console.log(list);
            let previewList: Array<VanityUrl>;
            let publishList: Array<VanityUrl>;
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
    public static UpdateContent(state: STATE){
        switch (state){
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
            case STATE.LEGACY:
                this.ShowElement(urlAlert);
                this.IsAdminPage(false);
                this.HideElement(previewCountAlert, publishCountAlert);
                break;
            default:
                break;
        }
    }
    public static UpdateActions(state: STATE){
        switch (state){
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
            case STATE.LEGACY:
                this.DisableElement(previewBtn, publishBtn, cancelBtn, langSelect);
                this.EnableElement(downloadBtn);
                break;
            default:
                break;
        }
    }
    public static UpdateSections(state: STATE){
        console.log(state);
        switch (state){
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
            case STATE.LEGACY:
                this.HideElement(langSection, introSection, loadingSection, buttonSection);
                this.ShowElement(downloadSection);
                break;
            default:
                break;
        }
    }
    public static HideElement(...nodes: Array<Element>){
        for( let node of nodes ){
            node.setAttribute('hidden', '');
        }
    }
    public static ShowElement(...nodes: Array<Element>){
        for( let node of nodes ){
            node.removeAttribute('hidden');
        }
    }
    public static DisableElement(...nodes: Array<Element>){
        for( let node of nodes ){
            node.setAttribute("disabled", "");
        }
    }
    public static EnableElement(...nodes: Array<Element>){
        for( let node of nodes ){
            node.removeAttribute("disabled");
        }
    }
    public static IsAdminPage(adminPage: Boolean){
        if (adminPage) {
            urlAlert.innerHTML = `You are on the Vanity URL page for ${currentSite}`;
            urlAlert.style.color = "green";
        }
        else if (isLegacy) {
            urlAlert.innerHTML = 'You are on a Legacy Vanity URL page, you will only \
            be able to export URLs to JSON format.';
            urlAlert.style.color = "orange";
            document.querySelector<HTMLParagraphElement>('#download-section__text')
            .innerText = "Export legacy URLs on page to JSON format";
        }
        else {
            urlAlert.innerHTML = "You are not on a Vanity URL page";
            urlAlert.style.color = "red";
        }
    }
    public static UpdateURLCount(node: HTMLSpanElement, count: string){
        node.innerText = count;
    }
    public static AddLanguage(){
        if(langSelect){
            for(var lang in LangMap){
                let list: Array<VanityUrl> = vuLists[lang+"List"]
                console.log(list);
                if (list.length > 0 && !langSelect.namedItem(lang)){
                    let opt: HTMLOptionElement = document.createElement("option");
                    opt.setAttribute("id", lang);
                    opt.value = lang;
                    opt.text = LangMap[lang];
                    langSelect.add(opt);
                }
            }
        }
    }
}

type VUAction = "Publish" | "Preview";
class VanityActions {
    static CheckOngoingActions(){
        if (localStorage.getItem("vanityAction") == "true"){
            if (localStorage.getItem('vanityURL') == currentSite){
                let lang: string = localStorage.getItem('vanityLanguage') ? localStorage.getItem('vanityLanguage') : "";
                if (localStorage.getItem('vanityPreview') == "true"){
                    if (previewCount > 0 && lang){
                        langSelect.value = lang;
                        StateMachine.UpdateData();
                        this.ActionVanities("Preview", lang);
                    }
                    else {
                        this.CancelAll();
                    }
                }
                if (localStorage.getItem('vanityPublish') == "true"){
                    if (publishCount > 0 && lang){
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
    static ActionVanities(action: VUAction, lang: string){
        StateMachine.current = STATE.WORKING
        let listId: string = lang + "List";
        let list: Array<VanityUrl> = action == "Preview" ? VanityUrlLists.FilterByPreview(vuLists[listId]) : VanityUrlLists.FilterByPublish(vuLists[listId]);
        let id: string = (list[0] as VanityUrl).id;
        urlAlert.innerHTML = `Currently ${action.toLowerCase()}ing ${LangMap[lang]} URLs for ${currentSite}`;
        urlAlert.style.color = 'orange';
        localStorage.setItem("vanityAction", "true");
        localStorage.setItem("vanityURL", currentSite);
        localStorage.setItem("vanityLanguage", lang);
        localStorage.setItem(("vanity"+action), 'true');
        chrome.scripting.executeScript({
            target : {tabId : activeTab.id},
            world : "MAIN",
            func : InjectFunc,
            args : [action, id]
        })
        setTimeout(() => {
            console.log('reloading popup');
            location.reload();
        }, 20000)
    }
    static CancelAll(){
        localStorage.removeItem("vanityAction");
        localStorage.removeItem("vanityURL");
        localStorage.removeItem('vanityLanguage');
        localStorage.removeItem('vanityPreview');
        localStorage.removeItem('vanityPublish');
        console.log('local storage cleared');
        console.log(localStorage);
        cancelText.innerHTML = 'Ongoing actions have been cancelled!';
    }
    static SetDownload(){
        if (isLegacy) {
            let blob = new Blob([legacyJSON], {type: "octect/stream"});
            let url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = "legacy_vanity-export.json";
        }
        else if (vuLists) {
            let json = JSON.stringify(vuLists[selectedLang+"List"], null, "\t");
            let blob = new Blob([json], {type: "octect/stream"});
            let url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = LangMap[selectedLang]+"_vanity-export.json";
        }
    }
}

function InjectFunc(action: string, id: string) {
    action = action.toLowerCase();
    const input: HTMLInputElement = document.querySelector<HTMLInputElement>(`input[value="${id}"]`);
    const parent: HTMLLIElement = input.closest<HTMLLIElement>('li');
    const btn: HTMLButtonElement = parent.querySelector<HTMLButtonElement>(`button.add-list-${action}`);
    console.log('starting inject');
    window.confirm = function(){
        return true;
    }
    btn.click();
    console.log('finished inject');
}

enum ACTION{
    PREVIEW = 'preview',
    PUBLISH = 'publish',
    UNPREVIEW = 'unpreview',
    UNPUBLISH = 'unpublish'
}
async function UpdateVanity(id, type){
    let preview;
    let unpreview;
    let publish;
    let unpublish;
    switch(type){
      case "preview":
        preview = "true";
        unpreview = "false";
        publish = "false";
        unpublish = "false";
        break;
      case "unpreview":
        preview = "false";
        unpreview = "true";
        publish = "false";
        unpublish = "false";
        break;
      case "publish":
        preview = "false";
        unpreview = "false";
        publish = "true";
        unpublish = "false";
        break;
      case "unpublish":
        preview = "false";
        unpreview = "false";
        publish = "false";
        unpublish = "true";
        break;
    }
    try {
      let response = await fetch("https://tbadmin.radancy.net/redirects/savevanitysearchurl", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://tbadmin.radancy.net/redirects/vanitysearchurls/1554/58858",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `SelectedCompanySiteId=58858&OrganizationId=1554&IsNewFullSite=True&ErrorMessage=&LanguageCode=EN&JobCustomFacetField=ALL&KeywordVanity=&DoubleclickTag=&UtmSource=&UtmMedium=&UtmCampaign=&VanitySearchUrls.index=${id}&VanitySearchUrls%5B${id}%5D.IsAdded=True&VanitySearchUrls%5B${id}%5D.IsDeleting=False&VanitySearchUrls%5B${id}%5D.IsPublishing=${publish}&VanitySearchUrls%5B${id}%5D.IsPreviewing=${preview}&VanitySearchUrls%5B${id}%5D.IsUnpublishingLive=${unpublish}&VanitySearchUrls%5B${id}%5D.IsUnpublishingPreview=${unpreview}&VanitySearchUrls%5B${id}%5D.VanityUrl=test&VanitySearchUrls%5B${id}%5D.LanguageCode=EN&VanitySearchUrls%5B${id}%5D.IsPublished=False&VanitySearchUrls%5B${id}%5D.EntityId=84688&VanitySearchUrls%5B${id}%5D.CategoryName=&VanitySearchUrls%5B${id}%5D.CategoryTerm=&VanitySearchUrls%5B${id}%5D.CategoryFacetType=&VanitySearchUrls%5B${id}%5D.LocationName=&VanitySearchUrls%5B${id}%5D.LocationTerm=&VanitySearchUrls%5B${id}%5D.LocationFacetType=&VanitySearchUrls%5B${id}%5D.CustomFacetFieldName=&VanitySearchUrls%5B${id}%5D.CustomFacetFieldTerm=&VanitySearchUrls%5B${id}%5D.CustomFacetFieldValue=&VanitySearchUrls%5B${id}%5D.NewMultiSelectMappingItem=&VanitySearchUrls%5B${id}%5D.VanitySearchUrlMapping=System.Collections.Generic.List%601%5BTmp.TalentBrew.Admin.Core.Models.VanitySearchUrlMappingModel%5D&VanitySearchUrls%5B${id}%5D.DoubleClickTag=&VanitySearchUrls%5B${id}%5D.UtmSource=&VanitySearchUrls%5B${id}%5D.UtmMedium=&VanitySearchUrls%5B${id}%5D.UtmCampaign=&__RequestVerificationToken=CfDJ8OGhF19QdBxMqro-CfTj-HlBVexjnDpSbxn6PrtIdrOZouQHSigdtJbm2NQHHWLm0KEi7p7osFawIIt8mfvj52NFo_dHzXLUPSEB3fsLmj07vEUMHQCc-NNMTbonbOBNx3WTos117--u_1SAjmpjU5ICp4-IyRHFINRIBAbx8Kv78_FLWKaOnejkb6eN05mb5w&X-Requested-With=XMLHttpRequest`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
      if (!response.ok){
        throw new Error("Network response issue")
      }
      let text = await response.text();
      console.log(text);
    }
    catch (error){
      console.log(`Error was ${error}`);
    }
  }

// Popup DOM Variables
const introSection: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('#intro-section');
const loadingSection = document.querySelector('#loading-section');
const buttonSection = document.querySelector('#button-section');
const langSection: HTMLElement = document.querySelector<HTMLElement>('#lang-select-section');
const langSelect: HTMLSelectElement = document.querySelector<HTMLSelectElement>('#lang-select-list');
const downloadSection: HTMLDivElement = document.querySelector<HTMLDivElement>('#download-section');
const downloadBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#download-section__button');
const downloadLink: HTMLAnchorElement = document.querySelector<HTMLAnchorElement>('#download-link');
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const cancelBtn = document.querySelector('#cancel-section__button');
const previewCountAlert = document.querySelector('#preview-count');
const previewCountNum: HTMLSpanElement = document.querySelector<HTMLSpanElement>('#preview-count-num');
const publishCountAlert = document.querySelector('#publish-count');
const publishCountNum: HTMLSpanElement = document.querySelector<HTMLSpanElement>('#publish-count-num');
const cancelText = document.querySelector('#cancel-text');
const urlAlert: HTMLElement = document.querySelector('#url-alert');

// URL Variables
const tbUS = "https://tbadmin.radancy.net/redirects/vanitysearchurls/"; // US Admin string
const tbEU = "https://tbadmin.radancy.eu/redirects/vanitysearchurls/"; // EU Admin string

// Functional variables
let currentSite: string = ""; // Site the vanity management page affects
let pageLoaded: boolean = false; // Is the vanity management page fully loaded
let activeTab; // Object containing information about the active tab
let commsPort; // Communication port for content script comms
let previewCount: number = 0; // How many URLs are ready for preview
let publishCount: number = 0; // How many URLs are ready for publish
let selectedLang: string = "all"; // Currently selected language
let isLegacy: boolean = false;
let legacyJSON: string = "";

// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    console.log(activeTabURL);
    csConnect("connect", "");
    if (activeTabURL.startsWith(tbUS) || activeTabURL.startsWith(tbEU)){
        StateMachine.current = STATE.LOADING;
        console.log(StateMachine.current)
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

function csConnect(type, content){
    let port;
    if (type == "connect"){
        port = chrome.tabs.connect(activeTab.id, { name: "content_connect" })
        commsPort = port;
        port.postMessage({message: "started", tabid: activeTab.id});
        AddUIEvents();
    }
    if (type == "message"){
        port.postMessage({message: content})
    }
    port.onMessage.addListener((msg) => {
        if (msg){
            if (msg.message === "page load" ){
                console.log("received page load message");
                pageLoaded = true;
                port.postMessage({ message: "vanity page loaded" })
            }
            if (msg.url){
                console.log(msg);
                currentSite = msg.url;
                StateMachine.current = STATE.READY;
                previewCount = msg.previewCount;
                publishCount = msg.publishCount;
                vuLists = msg.vuLists;
                isLegacy = msg.isLegacy;
                legacyJSON = msg.legacyJSON;
                if (isLegacy) { StateMachine.current = STATE.LEGACY };
                StateMachine.UpdateData();
                console.log('All VU Lists');
                console.log(msg.vuLists);
                VanityActions.CheckOngoingActions();
                VanityActions.SetDownload();
            }
        }
    })
}

function AddUIEvents(){
    previewBtn.addEventListener('click', () => {
        VanityActions.ActionVanities("Preview", selectedLang);
    })
    publishBtn.addEventListener('click', () => {
        VanityActions.ActionVanities("Publish", selectedLang);
    })
    cancelBtn.addEventListener('click', () => {
        VanityActions.CancelAll();
    })
    langSelect.addEventListener('change', (event) => {
        selectedLang = (event.target as HTMLSelectElement).value;
        StateMachine.UpdateData()
    })
}

function main(){
    StateMachine.current = STATE.INACTIVE;
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
}

main();
export{}