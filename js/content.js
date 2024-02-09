// Regex variables
const urlRegex = /\((.*?)\)/gm;
// Functional variables
let currentSite; // Careers site that the vanity management page affects
let isLegacy = false;
let vanityPageLoaded = false; // Vanity management page fully loaded
let previewBtns; // Array of all preview button DOM elements
let publishBtns; // Array of all publish button DOM elements
let commsPort; // Port to talk to the popup script
let tabID; // ID of current tab
let importObj;
// API Variables
let companySiteId; // current site id
let tenantId; // current client id
let authToken; // auth token for requests
let langCode;
let regionSetting;
let pageType;
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
    constructor(url, stageBtn, prodBtn, lang, id, facets, categories, locations, doubleClick, utmSource, utmMedium, utmCampaign) {
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
    static IsPublished(node) {
        if (node == null) {
            return false;
        }
        let text = node.innerText.toLowerCase();
        if (text == "publish") {
            return false;
        }
        return true;
    }
}
class VanityUrlLegacy {
    constructor(url, facets, categories, locations, doubleClick, utmSource, utmMedium, utmCampaign, isLive) {
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
VanityUrlLegacy.Count = 0;
function LegacyJSON(list) {
    let vuList = [];
    for (let item of list) {
        let url = item.querySelector('span.keyword-vanity-url').innerText;
        let mappings = item.querySelector('span.keyword-text');
        let facets;
        let categories;
        let locations;
        if (mappings.childNodes.length <= 1) {
            facets = item.querySelector('input[data-keyword-value="custom-facet-field-name"]').value;
            categories = item.querySelector('input[data-keyword-value="category-name"]').value;
            locations = item.querySelector('input[data-keyword-value="location-name"]').value;
        }
        else {
            facets = mappings.querySelector("span:nth-child(1)").childNodes.length > 0 ? mappings.querySelector("span:nth-child(1)").childNodes[1].wholeText : "";
            categories = mappings.querySelector("span:nth-child(2)").childNodes.length > 0 ? mappings.querySelector("span:nth-child(2)").childNodes[1].wholeText : "";
            locations = mappings.querySelector("span:nth-child(3)").childNodes.length > 0 ? mappings.querySelector("span:nth-child(3)").childNodes[1].wholeText : "";
        }
        let doubleClick = item.querySelector('span.keyword-double-click-tag-url').innerText;
        let utmSource = item.querySelector('span.utm-source-text').innerText;
        let utmMedium = item.querySelector('span.utm-medium-text').innerText;
        let utmCampaign = item.querySelector('span.utm-campaign-text').innerText;
        let isLive = item.querySelector('button.add-list-delete') ? false : true;
        let vu = new VanityUrlLegacy(url, facets, categories, locations, doubleClick, utmSource, utmMedium, utmCampaign, isLive);
        vuList.push(vu);
    }
    let json = JSON.stringify(vuList, null, "\t");
    return json;
}
let vuLists;
function CollectVanityURLs(vuList) {
    let vuArr = [];
    for (let item of vuList) {
        let node = item;
        let url = node.querySelector('.keyword-vanity-url').innerText;
        let lang = node.querySelector('.language-code').innerText;
        let id = node.querySelector('input[name="VanitySearchUrls.index"]').getAttribute("value");
        let mappings = node.querySelector('span.keyword-text').childNodes;
        let facets = mappings[0].childNodes.length > 0 ? mappings[0].childNodes[1].wholeText : "";
        let categories = mappings[2].childNodes.length > 0 ? mappings[2].childNodes[1].wholeText : "";
        let locations = mappings[4].childNodes.length > 0 ? mappings[4].childNodes[1].wholeText : "";
        let doubleClick = node.querySelector('span.keyword-double-click-tag-url').innerText;
        let utmSource = node.querySelector('span.utm-source-text').innerText;
        let utmMedium = node.querySelector('span.utm-medium-text').innerText;
        let utmCampaign = node.querySelector('span.utm-campaign-text').innerText;
        // let facets: string = (mappings[0] as HTMLSpanElement).innerText;
        // let categories: string = (mappings[2] as HTMLSpanElement).innerText;
        // let locations: string = (mappings[4] as HTMLSpanElement).innerText;
        let stageBtnDiv = node.querySelector('div.vanity-url-info').childNodes.item(7);
        let stageBtn = stageBtnDiv.querySelector('button');
        let prodBtnDiv = node.querySelector('div.vanity-url-info').childNodes.item(9);
        let prodBtns = prodBtnDiv.querySelectorAll('button');
        let prodBtn;
        for (let node of prodBtns) {
            let btn = node;
            if (btn == null) {
                prodBtn = null;
            }
            if (!btn.hasAttribute('disabled')) {
                prodBtn = btn;
            }
        }
        let vu = new VanityUrl(url, stageBtn, prodBtn, lang, id, facets, categories, locations, doubleClick, utmSource, utmMedium, utmCampaign);
        console.log(vu);
        vuArr.push(vu);
    }
    console.log(vuArr);
    vuLists = new VanityUrlLists(vuArr);
}
function AlertWindow(msg) {
    alert(msg);
}
chrome.runtime.onConnect.addListener((port) => {
    commsPort = port;
    console.log(port);
    console.assert(port.name === "content_connect");
    port.onMessage.addListener((msg) => {
        if (msg) {
            if (msg.message == "started") {
                tabID = msg.tabid;
                console.log(tabID);
                if (document.readyState === "complete") {
                    port.postMessage({ message: "page load" });
                }
            }
            if (msg.message == "vanity page loaded") {
                if (currentSite == null || currentSite == undefined) {
                    currentSite = document.querySelector('.search-drop').innerHTML;
                    currentSite = urlRegex.exec(currentSite);
                    currentSite = currentSite[1];
                }
                console.log(`cs sending url - ${currentSite}`);
                let vuList = document.querySelectorAll('li.vanity-url');
                console.log(`preparing to create vus from ${vuList}`);
                CollectVanityURLs(vuList);
                isLegacy = document.querySelector('#language-code') || document.querySelector('#language-code') != null ? false : true;
                let vuLegacyList = document.querySelectorAll('ul.vanity-keywords li');
                let legacyJSON;
                if (isLegacy) {
                    legacyJSON = LegacyJSON(vuLegacyList);
                }
                ;
                previewBtns = document.querySelectorAll('.add-list-preview');
                publishBtns = document.querySelectorAll('.add-list-publish:not([disabled])');
                port.postMessage({ url: currentSite, previewCount: previewBtns.length,
                    publishCount: publishBtns.length, vuLists: vuLists, isLegacy: isLegacy, legacyJSON: legacyJSON });
                vanityPageLoaded = true;
            }
            if (msg.message == "import") {
                importObj = JSON.parse(msg.importObj);
                let opt = (document.querySelector("select#language-code").options);
                let langList = [];
                for (let item of opt) {
                    let arr = [];
                    arr[0] = item.text;
                    arr[1] = item.value;
                    langList.push(arr);
                }
                console.log(langList);
                port.postMessage({ message: "uploadLangList", langList: langList });
                console.log(importObj);
            }
        }
    });
});
function onError(error) {
    console.error(`Error: ${error}`);
}
window.addEventListener('load', () => {
    console.log('page loaded');
    if (commsPort != undefined) {
        commsPort.postMessage({ message: "page load" });
    }
});
//# sourceMappingURL=content.js.map