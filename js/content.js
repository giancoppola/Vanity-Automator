"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VanityUrl = exports.VanityUrlLists = void 0;
// Regex variables
var urlRegex = /\((.*?)\)/gm;
// Functional variables
var currentSite; // Careers site that the vanity management page affects
var vanityPageLoaded = false; // Vanity management page fully loaded
var previewBtns; // Array of all preview button DOM elements
var publishBtns; // Array of all publish button DOM elements
var commsPort; // Port to talk to the popup script
var tabID; // ID of current tab
var VanityUrlLists = /** @class */ (function () {
    function VanityUrlLists() {
    }
    VanityUrlLists.FilterByLang = function (list, lang) {
        return list.filter(function (el) { return el.lang == lang; });
    };
    VanityUrlLists.UpdateLists = function (list) {
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
    };
    return VanityUrlLists;
}());
exports.VanityUrlLists = VanityUrlLists;
var VanityUrl = /** @class */ (function () {
    function VanityUrl(url, stageBtn, prodBtn, lang) {
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.IsPublished(stageBtn);
        this.prodBtn = prodBtn;
        this.onProd = VanityUrl.IsPublished(prodBtn);
        this.lang = lang;
    }
    VanityUrl.IsPublished = function (node) {
        var text = node.innerText.toLowerCase();
        if (text == "publish") {
            return false;
        }
        return true;
    };
    return VanityUrl;
}());
exports.VanityUrl = VanityUrl;
function CollectVanityURLs(vuList) {
    var vuArr = [];
    for (var _i = 0, vuList_1 = vuList; _i < vuList_1.length; _i++) {
        var item = vuList_1[_i];
        var node = item;
        var url = node.querySelector('.keyword-vanity-url').innerText;
        var lang = node.querySelector('.language-code').innerText;
        var stageBtnDiv = node.querySelector('div.vanity-url-info').childNodes.item(7);
        var stageBtn = stageBtnDiv.querySelector('button');
        var prodBtnDiv = node.querySelector('div.vanity-url-info').childNodes.item(9);
        var prodBtns = prodBtnDiv.querySelectorAll('button');
        var prodBtn = void 0;
        for (var _a = 0, prodBtns_1 = prodBtns; _a < prodBtns_1.length; _a++) {
            var node_1 = prodBtns_1[_a];
            var btn = node_1;
            if (!btn.hasAttribute('disabled')) {
                prodBtn = btn;
            }
        }
        var vu = new VanityUrl(url, stageBtn, prodBtn, lang);
        console.log(vu);
        vuArr.push(vu);
    }
    console.log(vuArr);
    VanityUrlLists.UpdateLists(vuArr);
}
chrome.runtime.onConnect.addListener(function (port) {
    commsPort = port;
    console.log(port);
    console.assert(port.name === "content_connect");
    port.onMessage.addListener(function (msg) {
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
                console.log("cs sending url - ".concat(currentSite));
                var vuList = document.querySelectorAll('li.vanity-url');
                console.log("preparing to create vus from ".concat(vuList));
                CollectVanityURLs(vuList);
                previewBtns = document.querySelectorAll('.add-list-preview');
                publishBtns = document.querySelectorAll('.add-list-publish:not([disabled])');
                port.postMessage({ url: currentSite, previewCount: previewBtns.length, publishCount: publishBtns.length });
                vanityPageLoaded = true;
            }
        }
    });
});
function onError(error) {
    console.error("Error: ".concat(error));
}
window.addEventListener('load', function () {
    console.log('page loaded');
    if (commsPort != undefined) {
        commsPort.postMessage({ message: "page load" });
    }
});
