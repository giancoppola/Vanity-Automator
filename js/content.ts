/// <reference types="chrome"/>

// Regex variables
const urlRegex = /\((.*?)\)/gm

// Functional variables
let currentSite; // Careers site that the vanity management page affects
let vanityPageLoaded = false; // Vanity management page fully loaded
let previewBtns; // Array of all preview button DOM elements
let publishBtns; // Array of all publish button DOM elements
let commsPort; // Port to talk to the popup script
let tabID; // ID of current tab

export class VanityUrlLists{
    static fullList: Array<VanityUrl>;
    static enList: Array<VanityUrl>;
    static frList: Array<VanityUrl>;
    static deList: Array<VanityUrl>;
    static itList: Array<VanityUrl>;
    static arList: Array<VanityUrl>;
    static fiList: Array<VanityUrl>;
    static zhHansList: Array<VanityUrl>;
    static UpdateLists(list: Array<VanityUrl>){
        list.forEach(vu => {
            this.fullList.push(vu);
            switch(vu.lang){
                case "en":
                    this.enList.push(vu);
                    break;
            }
        })
    }
}

export class VanityUrl{
    url: string;
    onStage: boolean;
    stageBtn: HTMLElement;
    onProd: boolean;
    prodPublish: HTMLElement;
    prodUnpublish: HTMLElement;
    lang: string;
    constructor(url:string, stageBtn: HTMLElement, prodPublish: HTMLElement, prodUnpublish: HTMLElement, lang: string){
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.StagingCheck(stageBtn);
        this.prodPublish = prodPublish;
        this.prodUnpublish = prodUnpublish;
        this.onProd = VanityUrl.LiveCheck(prodPublish);
        this.lang = lang;
    }
    static StagingCheck(node: HTMLElement){
        let text: string = node.innerText;
        if (text == "Publish"){
            return false;
        }
        return true
    }
    static LiveCheck(node: HTMLElement){
        if (node.hasAttribute('disabled')){
            return true;
        }
        return false;
    }
}

const vuList: NodeList = document.querySelectorAll('li.vanity-url');
for(let item of vuList){
    let node = item as HTMLElement;
    let url: string = node.querySelector<HTMLElement>('.keyword-vanity-url').innerText;
    let lang: string = ;
    let vu: VanityUrl = new VanityUrl(
        
    )
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
                previewBtns = document.querySelectorAll('.add-list-preview');
                publishBtns = document.querySelectorAll('.add-list-publish:not([disabled])');
                port.postMessage({url: currentSite, previewCount: previewBtns.length, publishCount: publishBtns.length});
                vanityPageLoaded = true;
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