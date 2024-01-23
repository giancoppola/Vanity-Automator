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
    VanityUrlLists.UpdateLists = function (list) {
        this.fullList = list;
        console.log(this.fullList);
        this.enList = list.filter(function (el) { el.lang.toLowerCase() == "en"; });
        this.frList = list.filter(function (el) { el.lang.toLowerCase() == "fr"; });
        this.deList = list.filter(function (el) { el.lang.toLowerCase() == "de"; });
        this.itList = list.filter(function (el) { el.lang.toLowerCase() == "it"; });
        this.esList = list.filter(function (el) { el.lang.toLowerCase() == "es"; });
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
