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
    static fullList: Array<VanityUrl>; static enList: Array<VanityUrl>; static frList: Array<VanityUrl>;
    static deList: Array<VanityUrl>; static esList: Array<VanityUrl>; static ptBrList: Array<VanityUrl>;
    static zhHansList: Array<VanityUrl>; static jaList: Array<VanityUrl>; static zhHantList: Array<VanityUrl>;
    static frCaList: Array<VanityUrl>; static itList: Array<VanityUrl>; static svList: Array<VanityUrl>;
    static nlList: Array<VanityUrl>; static ruList: Array<VanityUrl>; static huList: Array<VanityUrl>;
    static csList: Array<VanityUrl>; static plList: Array<VanityUrl>; static arList: Array<VanityUrl>;
    static daList: Array<VanityUrl>; static koList: Array<VanityUrl>; static lvList: Array<VanityUrl>;
    static ltList: Array<VanityUrl>; static irList: Array<VanityUrl>; static srList: Array<VanityUrl>;
    static skList: Array<VanityUrl>; static roList: Array<VanityUrl>; static fiList: Array<VanityUrl>;
    static noList: Array<VanityUrl>; static hrList: Array<VanityUrl>; static slList: Array<VanityUrl>;
    static etList: Array<VanityUrl>; static viList: Array<VanityUrl>; static ukList: Array<VanityUrl>;
    static thList: Array<VanityUrl>; static msList: Array<VanityUrl>; static heList: Array<VanityUrl>;
    static enGbList: Array<VanityUrl>;
    static UpdateLists(list: Array<VanityUrl>){
        this.fullList = list;
        console.log(this.fullList);
        this.enList = list.filter((el) => { el.lang.toLowerCase() == "en" });
        this.frList = list.filter((el) => { el.lang.toLowerCase() == "fr" });
        this.deList = list.filter((el) => { el.lang.toLowerCase() == "de" });
        this.esList = list.filter((el) => { el.lang.toLowerCase() == "es" });
        this.ptBrList = list.filter((el) => { el.lang.toLowerCase() == "pt-br" });
        this.zhHansList = list.filter((el) => { el.lang.toLowerCase() == "zh-hans" });
        this.jaList = list.filter((el) => { el.lang.toLowerCase() == "ja" });
        this.zhHantList = list.filter((el) => { el.lang.toLowerCase() == "zh-hant" });
        this.frCaList = list.filter((el) => { el.lang.toLowerCase() == "fr-ca" });
        this.itList = list.filter((el) => { el.lang.toLowerCase() == "it" });
        this.svList = list.filter((el) => { el.lang.toLowerCase() == "sv" });
        this.nlList = list.filter((el) => { el.lang.toLowerCase() == "nl" });
        this.ruList = list.filter((el) => { el.lang.toLowerCase() == "ru" });
        this.huList = list.filter((el) => { el.lang.toLowerCase() == "hu" });
        this.huList = list.filter((el) => { el.lang.toLowerCase() == "hu" });
        this.csList = list.filter((el) => { el.lang.toLowerCase() == "cs" });
        this.plList = list.filter((el) => { el.lang.toLowerCase() == "pl" });
        this.arList = list.filter((el) => { el.lang.toLowerCase() == "ar" });
        this.daList = list.filter((el) => { el.lang.toLowerCase() == "da" });
        this.koList = list.filter((el) => { el.lang.toLowerCase() == "ko" });
        this.lvList = list.filter((el) => { el.lang.toLowerCase() == "lv" });
        this.ltList = list.filter((el) => { el.lang.toLowerCase() == "lt" });
        this.irList = list.filter((el) => { el.lang.toLowerCase() == "ir" });
        this.srList = list.filter((el) => { el.lang.toLowerCase() == "sr" });
        this.skList = list.filter((el) => { el.lang.toLowerCase() == "sk" });
        this.roList = list.filter((el) => { el.lang.toLowerCase() == "ro" });
        this.fiList = list.filter((el) => { el.lang.toLowerCase() == "fi" });
        this.noList = list.filter((el) => { el.lang.toLowerCase() == "no" });
        this.hrList = list.filter((el) => { el.lang.toLowerCase() == "hr" });
        this.slList = list.filter((el) => { el.lang.toLowerCase() == "sl" });
        this.etList = list.filter((el) => { el.lang.toLowerCase() == "et" });
        this.viList = list.filter((el) => { el.lang.toLowerCase() == "vi" });
        this.ukList = list.filter((el) => { el.lang.toLowerCase() == "uk" });
        this.thList = list.filter((el) => { el.lang.toLowerCase() == "th" });
        this.msList = list.filter((el) => { el.lang.toLowerCase() == "ms" });
        this.heList = list.filter((el) => { el.lang.toLowerCase() == "he" });
        this.enGbList = list.filter((el) => { el.lang.toLowerCase() == "en-gb" });
    }
}

export class VanityUrl{
    url: string;
    onStage: boolean;
    stageBtn: HTMLButtonElement;
    onProd: boolean;
    prodBtn: HTMLButtonElement;
    lang: string;
    constructor(url:string, stageBtn: HTMLButtonElement, prodBtn: HTMLButtonElement, lang: string){
        this.url = url;
        this.stageBtn = stageBtn;
        this.onStage = VanityUrl.IsPublished(stageBtn);
        this.prodBtn = prodBtn;
        this.onProd = VanityUrl.IsPublished(prodBtn);
        this.lang = lang;
    }
    static IsPublished(node: HTMLButtonElement){
        let text: string = node.innerText.toLowerCase();
        if (text == "publish"){
            return false;
        }
        return true
    }
}

function CollectVanityURLs(vuList: NodeList){
    let vuArr: Array<VanityUrl> = [];
    for(let item of vuList){
        let node = item as HTMLElement;
        let url: string = node.querySelector<HTMLSpanElement>('.keyword-vanity-url').innerText;
        let lang: string = node.querySelector<HTMLSpanElement>('.language-code').innerText;
        let stageBtnDiv: HTMLDivElement = node.querySelector<HTMLDivElement>('div.vanity-url-info').childNodes.item(7) as HTMLDivElement;
        let stageBtn: HTMLButtonElement = stageBtnDiv.querySelector('button');
        let prodBtnDiv: HTMLDivElement = node.querySelector<HTMLDivElement>('div.vanity-url-info').childNodes.item(9) as HTMLDivElement;
        let prodBtns: NodeList = prodBtnDiv.querySelectorAll('button');
        let prodBtn: HTMLButtonElement;
        for(let node of prodBtns){
            let btn = node as HTMLButtonElement;
            if (!btn.hasAttribute('disabled')){
                prodBtn = btn;
            }
        }
        let vu: VanityUrl = new VanityUrl(
            url,
            stageBtn,
            prodBtn,
            lang
        )
        console.log(vu);
        vuArr.push(vu);
    }
    console.log(vuArr);
    VanityUrlLists.UpdateLists(vuArr);
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