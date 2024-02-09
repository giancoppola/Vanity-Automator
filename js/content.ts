// Regex variables
const urlRegex = /\((.*?)\)/gm

// Functional variables
let currentSite; // Careers site that the vanity management page affects
let isLegacy: boolean = false;
let vanityPageLoaded = false; // Vanity management page fully loaded
let previewBtns; // Array of all preview button DOM elements
let publishBtns; // Array of all publish button DOM elements
let commsPort; // Port to talk to the popup script
let tabID; // ID of current tab
let importObj: Array<Object>;

// API Variables
let companySiteId: string; // current site id
let tenantId: string; // current client id
let authToken: string; // auth token for requests
let langCode: string;
let regionSetting: string;
let pageType: string;

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
    doubleClick: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    constructor(url:string, stageBtn: HTMLButtonElement, prodBtn: HTMLButtonElement,
        lang: string, id: string, facets: string, categories: string, locations: string,
        doubleClick: string, utmSource: string, utmMedium: string, utmCampaign: string){
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
        this.doubleClick = doubleClick;
        this.utmSource = utmSource;
        this.utmMedium = utmMedium;
        this.utmCampaign = utmCampaign;
    }
    static IsPublished(node: HTMLButtonElement){
        if (node == null){
            return false;
        }
        let text: string = node.innerText.toLowerCase();
        if (text == "publish"){
            return false;
        }
        return true
    }
}

class VanityUrlLegacy{
    static Count: number = 0;
    url: string;
    facets: string;
    categories: string;
    locations: string;
    doubleClick: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    isLive: boolean;
    constructor(url: string, facets: string, categories: string,
        locations: string, doubleClick: string, utmSource: string,
        utmMedium: string, utmCampaign: string, isLive: boolean){
        this.url = url;
        this.facets = facets;
        this.categories = categories;
        this.locations = locations;
        this.doubleClick = doubleClick;
        this.utmSource = utmSource;
        this.utmMedium = utmMedium;
        this.utmCampaign = utmCampaign;
        this.isLive = isLive;
        VanityUrlLegacy.Count++;
    }
}
function LegacyJSON(list: NodeList){
    let vuList: Array<VanityUrlLegacy> = [];
    for(let item of list){
        let url: string = (item as HTMLLIElement).querySelector<HTMLSpanElement>('span.keyword-vanity-url').innerText;
        let mappings: HTMLSpanElement = (item as HTMLLIElement).querySelector<HTMLSpanElement>('span.keyword-text');
        let facets: string;
        let categories: string;
        let locations: string;
        if (mappings.childNodes.length <= 1){
            facets = (item as HTMLLIElement).querySelector<HTMLInputElement>('input[data-keyword-value="custom-facet-field-name"]').value;
            categories = (item as HTMLLIElement).querySelector<HTMLInputElement>('input[data-keyword-value="category-name"]').value;
            locations = (item as HTMLLIElement).querySelector<HTMLInputElement>('input[data-keyword-value="location-name"]').value;
        }
        else{
            facets = mappings.querySelector<HTMLSpanElement>("span:nth-child(1)").childNodes.length > 0 ? (mappings.querySelector<HTMLSpanElement>("span:nth-child(1)").childNodes[1] as Text).wholeText : "";
            categories = mappings.querySelector<HTMLSpanElement>("span:nth-child(2)").childNodes.length > 0 ? (mappings.querySelector<HTMLSpanElement>("span:nth-child(2)").childNodes[1] as Text).wholeText : "";
            locations = mappings.querySelector<HTMLSpanElement>("span:nth-child(3)").childNodes.length > 0 ? (mappings.querySelector<HTMLSpanElement>("span:nth-child(3)").childNodes[1] as Text).wholeText : "";
        }
        let doubleClick: string = (item as HTMLLIElement).querySelector<HTMLSpanElement>('span.keyword-double-click-tag-url').innerText;
        let utmSource: string = (item as HTMLLIElement).querySelector<HTMLSpanElement>('span.utm-source-text').innerText;
        let utmMedium: string = (item as HTMLLIElement).querySelector<HTMLSpanElement>('span.utm-medium-text').innerText;
        let utmCampaign: string = (item as HTMLLIElement).querySelector<HTMLSpanElement>('span.utm-campaign-text').innerText;
        let isLive: boolean = (item as HTMLLIElement).querySelector<HTMLButtonElement>('button.add-list-delete') ? false : true;
        let vu = new VanityUrlLegacy(
            url,
            facets,
            categories,
            locations,
            doubleClick,
            utmSource,
            utmMedium,
            utmCampaign,
            isLive
        )
        vuList.push(vu);
    }
    let json: string = JSON.stringify(vuList, null, "\t");
    return json;
}

let vuLists: VanityUrlLists;
function CollectVanityURLs(vuList: NodeList){
    let vuArr: Array<VanityUrl> = [];
    for(let item of vuList){
        let node = item as HTMLElement;
        let url: string = node.querySelector<HTMLSpanElement>('.keyword-vanity-url').innerText;
        let lang: string = node.querySelector<HTMLSpanElement>('.language-code').innerText;
        let id: string = node.querySelector<HTMLInputElement>('input[name="VanitySearchUrls.index"]').getAttribute("value");
        let mappings: NodeList = node.querySelector<HTMLSpanElement>('span.keyword-text').childNodes;
        let facets = mappings[0].childNodes.length > 0 ? (mappings[0].childNodes[1] as Text).wholeText : "";
        let categories = mappings[2].childNodes.length > 0 ? (mappings[2].childNodes[1] as Text).wholeText : "";
        let locations = mappings[4].childNodes.length > 0 ? (mappings[4].childNodes[1] as Text).wholeText : "";
        let doubleClick: string = node.querySelector<HTMLSpanElement>('span.keyword-double-click-tag-url').innerText;
        let utmSource: string = node.querySelector<HTMLSpanElement>('span.utm-source-text').innerText;
        let utmMedium: string = node.querySelector<HTMLSpanElement>('span.utm-medium-text').innerText;
        let utmCampaign: string = node.querySelector<HTMLSpanElement>('span.utm-campaign-text').innerText;
        // let facets: string = (mappings[0] as HTMLSpanElement).innerText;
        // let categories: string = (mappings[2] as HTMLSpanElement).innerText;
        // let locations: string = (mappings[4] as HTMLSpanElement).innerText;
        let stageBtnDiv: HTMLDivElement = node.querySelector<HTMLDivElement>('div.vanity-url-info').childNodes.item(7) as HTMLDivElement;
        let stageBtn: HTMLButtonElement = stageBtnDiv.querySelector('button');
        let prodBtnDiv: HTMLDivElement = node.querySelector<HTMLDivElement>('div.vanity-url-info').childNodes.item(9) as HTMLDivElement;
        let prodBtns: NodeList = prodBtnDiv.querySelectorAll('button');
        let prodBtn: HTMLButtonElement;
        for(let node of prodBtns){
            let btn = node as HTMLButtonElement;
            if (btn == null){
                prodBtn = null;
            }
            if (!btn.hasAttribute('disabled')){
                prodBtn = btn;
            }
        }
        let vu: VanityUrl = new VanityUrl(
            url,
            stageBtn,
            prodBtn,
            lang,
            id,
            facets,
            categories,
            locations,
            doubleClick,
            utmSource,
            utmMedium,
            utmCampaign
        )
        console.log(vu);
        vuArr.push(vu);
    }
    console.log(vuArr);
    vuLists = new VanityUrlLists(vuArr);
}

function AlertWindow(msg: string){
    alert(msg);
}

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
                let vuList: NodeList = document.querySelectorAll('li.vanity-url');
                console.log(`preparing to create vus from ${vuList}`);
                CollectVanityURLs(vuList);
                isLegacy = document.querySelector('#language-code') || document.querySelector('#language-code') != null ? false : true;
                let vuLegacyList: NodeList = document.querySelectorAll('ul.vanity-keywords li');
                let legacyJSON: string;
                if (isLegacy) { legacyJSON = LegacyJSON(vuLegacyList) };
                previewBtns = document.querySelectorAll('.add-list-preview');
                publishBtns = document.querySelectorAll('.add-list-publish:not([disabled])');
                port.postMessage({url: currentSite, previewCount: previewBtns.length,
                publishCount: publishBtns.length, vuLists: vuLists, isLegacy: isLegacy, legacyJSON: legacyJSON});
                vanityPageLoaded = true;
            }
            if (msg.message == "import"){
                importObj = JSON.parse(msg.importObj);
                let opt: HTMLOptionsCollection = (document.querySelector<HTMLSelectElement>("select#language-code").options);
                let langList: Array<Array<string>> = [];
                for(let item of opt){
                    let arr: Array<string> = [];
                    arr[0] = item.text;
                    arr[1] = item.value;
                    langList.push(arr);
                }
                console.log(langList);
                port.postMessage({message: "uploadLangList", langList: langList});
                console.log(importObj);
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