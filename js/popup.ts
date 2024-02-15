import {LangMap, VanityUrlLegacy, VanityUrl, VanityUrlLists, JsonReader, Tools} from "../js/types.js";
import Papa from "../js/papaparse.min.js";

// Popup DOM Variables
/// Section Elements
const introSection: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('#intro-section');
const loadingSection = document.querySelector('#loading-section');
const buttonSection = document.querySelector('#button-section');
/// Lang Section Elements
const langSection: HTMLElement = document.querySelector<HTMLElement>('#lang-select-section');
const langSelect: HTMLSelectElement = document.querySelector<HTMLSelectElement>('#lang-select-list');
/// Download Section Elements
const downloadSection: HTMLDivElement = document.querySelector<HTMLDivElement>('#download-section');
const downloadBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#download-section__button');
const downloadLink: HTMLAnchorElement = document.querySelector<HTMLAnchorElement>('#download-link');
/// Upload Section Elements
const uploadSection: HTMLDivElement = document.querySelector<HTMLDivElement>('#upload-section');
const uploadBtn: HTMLInputElement = document.querySelector<HTMLInputElement>('#upload-section__button');
const uploadText: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('#upload-text');
const uploadInfo: HTMLDivElement = document.querySelector<HTMLDivElement>('#upload-info-container');
const uploadCount: HTMLSpanElement = document.querySelector<HTMLSpanElement>('#upload-count');
const uploadLangSelect: HTMLSelectElement = document.querySelector<HTMLSelectElement>("#upload-lang-select-list");
const uploadBeginBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#add-urls__button");
const uploadRestrict: HTMLInputElement = document.querySelector<HTMLInputElement>("#upload-restrict");
const uploadRestrictDisplay: HTMLSpanElement = document.querySelector<HTMLSpanElement>("#upload-restrict-display");
/// Button Elements
const previewBtn = document.querySelector('#preview-all-section__button');
const publishBtn = document.querySelector('#publish-all-section__button');
const cancelBtn = document.querySelector('#cancel-section__button');
/// Text Elements
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
let vuLists: VanityUrlLists;
let importObj: string;

enum STATE {
    LOADING = "loading",
    READY = "ready",
    WORKING = "working",
    INACTIVE = "inactive",
    LEGACY = "legacy",
    IMPORTED = "imported"
}
class StateMachine {
    private static currentState: STATE = STATE.INACTIVE;
    public static get current(){
        return this.currentState;
    }
    public static set current(state: STATE){
        this.UpdateState(state);
        this.currentState = state;
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
    public static UpdateActions(state: STATE){
        switch (state){
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
    public static UpdateSections(state: STATE){
        switch (state){
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
    static SetUpload(str: string){
        importObj = str;
        uploadCount.innerText = (JSON.parse(importObj) as Array<VanityUrlLegacy>).length.toString();
        StateMachine.current = STATE.IMPORTED;
        port.postMessage({message: "import", importObj: importObj});
    }
    static SetUploadLang(langList: Array<Array<string>>){
        for(let opt of langList){
            let lang = document.createElement("option");
            lang.text = opt[0];
            lang.value = opt[1];
            uploadLangSelect.add(lang);
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

// gathers information on the currently active tab
function logTabs(tabs) {
    activeTab = tabs[0];
    let activeTabURL = tabs[0].url;
    csConnect("connect", "");
    if (activeTabURL.startsWith(tbUS) || activeTabURL.startsWith(tbEU)){
        StateMachine.current = STATE.LOADING;
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

let port;
function csConnect(type, content){
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
                currentSite = msg.url;
                StateMachine.current = STATE.READY;
                previewCount = msg.previewCount;
                publishCount = msg.publishCount;
                vuLists = msg.vuLists;
                isLegacy = msg.isLegacy;
                legacyJSON = msg.legacyJSON;
                if (isLegacy) { StateMachine.current = STATE.LEGACY };
                StateMachine.UpdateData();
                VanityActions.CheckOngoingActions();
                VanityActions.SetDownload();
            }
            if (msg.message === "uploadLangList"){
                VanityActions.SetUploadLang(msg.langList);
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
    uploadBtn.onchange = (e) => {
        // if ((e.target as HTMLInputElement).files[0].type == )
        if ((e.target as HTMLInputElement).files[0].type == "application/json"){
            uploadText.innerText = "";
            JsonReader.ImportJson((e.target as HTMLInputElement).files[0])
            .then((str) => {
                VanityActions.SetUpload(str);
            });
        }
        else {
            StateMachine.HideElement(uploadInfo);
            uploadText.innerText = "Please upload a JSON file.";
        }
    }
    uploadBeginBtn.addEventListener('click', () => {
        let lang: Array<string> = []
        if (uploadLangSelect.value == "all"){
            for(let item of (uploadLangSelect.options as HTMLOptionsCollection)){
                if (item.value == "all"){
                    continue;
                }
                lang.push(item.value);
            }
        }
        else {
            lang.push(uploadLangSelect.value);
        }
        port.postMessage({ message: "add", lang: lang, restrict: uploadRestrict.value });
    })
    uploadRestrict.onchange = (e) => {
        console.log("firing?");
        uploadRestrictDisplay.innerText = (e.target as HTMLInputElement).value;
    }
}

function main(){
    StateMachine.current = STATE.INACTIVE;
    chrome.tabs
        .query({ currentWindow: true, active: true })
        .then(logTabs, onError);
    let fileInput: string = "vanity-import-template.csv";
    Papa.parse(fileInput, {
        header: true,
        complete: function(results) {
            console.log(results);
        }
    });
}

main();