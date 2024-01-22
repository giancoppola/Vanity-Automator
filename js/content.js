"use strict";
/// <reference types="chrome"/>
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
        var _this = this;
        list.forEach(function (vu) {
            _this.fullList.push(vu);
            switch (vu.lang) {
                case "en":
                    _this.enList.push(vu);
                    break;
            }
        });
    };
    return VanityUrlLists;
}());
exports.VanityUrlLists = VanityUrlLists;
var VanityUrl = /** @class */ (function () {
    function VanityUrl(url, stageBtn, prodPublish, prodUnpublish, lang) {
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.StagingCheck(stageBtn);
        this.prodPublish = prodPublish;
        this.prodUnpublish = prodUnpublish;
        this.onProd = VanityUrl.LiveCheck(prodPublish);
        this.lang = lang;
    }
    VanityUrl.StagingCheck = function (node) {
        var text = node.innerText;
        if (text == "Publish") {
            return false;
        }
        return true;
    };
    VanityUrl.LiveCheck = function (node) {
        if (node.hasAttribute('disabled')) {
            return true;
        }
        return false;
    };
    return VanityUrl;
}());
exports.VanityUrl = VanityUrl;
var vuList = document.querySelectorAll('li.vanity-url');
for (var _i = 0, vuList_1 = vuList; _i < vuList_1.length; _i++) {
    var item = vuList_1[_i];
    var node = item;
    var url = node.querySelector('.keyword-vanity-url').innerText;
    var lang = ;
    var vu = new VanityUrl();
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
