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
    static FilterByLang(list: Array<VanityUrl>, lang: string){
        return list.filter((el) => el.lang == lang);
    }
    static UpdateLists(list: Array<VanityUrl>){
        this.fullList = list;
        console.log(this.fullList);
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
        this.irList = VanityUrlLists.FilterByLang( list, "ir" );
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