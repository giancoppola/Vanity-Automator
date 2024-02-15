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
let importObj: Array<VanityUrlLegacy>;

// API Variables
let vanityData: HTMLDivElement;
let organizationId: string;
let companySiteId: string; // current site id
let tenantId: string; // current client id
let authToken: string; // auth token for requests
let langCode: string;
let regionSetting: string;
let pageType: string;
let apiVersion: string;
let isDual: string;
let allowDupes: string;

class Tools{
    static CapitaliseFirstLetters(str: string){
        let res: string;
        let arr: Array<string> = str.split(" ");
        for(let item of arr){
            item[0].toUpperCase()
        }
        res = arr.join(" ");
        return res;
    }
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
    static Count: number = 1;
    intId: number;
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
        this.intId = VanityUrl.Count;
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
        VanityUrl.Count++;
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
    static Count: number = 1;
    intId: number;
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
        this.intId = VanityUrlLegacy.Count;
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
            url.trim(),
            facets.trim(),
            categories.trim(),
            locations.trim(),
            doubleClick.trim(),
            utmSource.trim(),
            utmMedium.trim(),
            utmCampaign.trim(),
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
            url.trim(),
            stageBtn,
            prodBtn,
            lang.trim(),
            id.trim(),
            facets.trim(),
            categories.trim(),
            locations.trim(),
            doubleClick.trim(),
            utmSource.trim(),
            utmMedium.trim(),
            utmCampaign.trim()
        )
        vuArr.push(vu);
    }
    vuLists = new VanityUrlLists(vuArr);
}

function AlertWindow(msg: string){
    alert(msg);
}

type CallType = "Categories" | "Locations" | "CustomFacets" | "NA";
class ImportError{
    static All: Array<ImportError> = [];
    intId: number;
    errorCategory: CallType;
    errorValues: string;
    errorURL: string;
    errorLang: string;
    errorMsg: string;
    constructor(intId: number, errorCategory: CallType, errorValues: string,
    errorURL: string, errorLang: string, errorMsg: string){
        this.intId = intId;
        this.errorCategory = errorCategory;
        this.errorValues = errorValues;
        this.errorURL = errorURL;
        this.errorLang = errorLang;
        this.errorMsg = errorMsg;
    }
}
class ImportURLs{
    static Current: VanityUrlLegacy;
    static Lang: string;
    static async BeginImport(langs: Array<string>, restrict: string){
        let opt: HTMLSelectElement = document.querySelector<HTMLSelectElement>("select#language-code");
        for(let lang of langs){
            console.log(`now starting import, using ${lang} language`);
            opt.value = lang;
            let count: number = 0;
            if (parseInt(restrict) > 0){
                for(let item of importObj){
                    if (count <= parseInt(restrict)){
                        ImportURLs.Lang = lang;
                        ImportURLs.Current = item;
                        await this.AddCategories(item.categories);
                        await this.AddLocations(item.locations);
                        await this.AddFacets(item.facets);
                        await this.AddTrackingAndURL(item);
                        await this.AddVanity();
                        count++;
                    }
                }
            }
            else {
                for(let item of importObj){
                    ImportURLs.Lang = lang;
                    ImportURLs.Current = item;
                    await this.AddCategories(item.categories);
                    await this.AddLocations(item.locations);
                    await this.AddFacets(item.facets);
                    await this.AddTrackingAndURL(item);
                    await this.AddVanity();
                    count++;
                }
            }
        }
        this.EndAlert();
    }
    static CreateError(type: CallType, msg: string){
        let values: string;
        switch(type){
            case "Categories":
                values = ImportURLs.Current.categories;
                break;
            case "Locations":
                values = ImportURLs.Current.locations;
                break;
            case "CustomFacets":
                values = ImportURLs.Current.facets;
                break;
        }
        let error: ImportError = new ImportError(
            ImportURLs.Current.intId,
            type,
            values,
            ImportURLs.Current.url,
            ImportURLs.Lang,
            msg
        )
        ImportError.All.push(error);
    }
    static async AddCategories(cats: string){
        let keyArr: Array<string> = cats.split(", ");
        let catArr: Array<Object> = [];
        let count: number = 1;
        for(let key of keyArr){
            let catObj: Object = await this.GetCategory(key.trim(), count);
            catArr.push(catObj);
            count++;
        }
        this.SetCategory(catArr);
    }
    static async GetCategory(key: string, count: number){
        let cats: Array<Object> = await this.FetchData(key, "Categories");
        if (cats.length < 1){
            if (count < 2){
                this.CreateError("Categories", `No matches found, used ALL keyword`);
                return {
                    "Id": 0,
                    "CategoryTerm": "ALL",
                    "CategoryName": "ALL",
                    "CategoryFacetType": 0,
                    "CustomFacets": [],
                    "DateUpdated": "0001-01-01T00:00:00",
                    "IsInherited": false,
                    "IsOtherThemeKeyword": false,
                    "SiteGroupOrganizations": "",
                    "SiteGroupOrganizationIds": [],
                    "Priority": 0
                }
            }
            else {
                this.CreateError("Categories", `No matches found, skipped ${key}`);
                return null;
            }
        }
        for(let item of cats){
            if (item["CategoryName"] == key){
                return item;
            }
        }
        this.CreateError(
            "Categories",
            `No direct match found, used first returned item - ${cats[0]["CategoryName"]}`
        )
        return cats[0];
    }
    static SetCategory(cats: Array<Object>){
        for(let cat of cats){
            if (cat == null){
                continue;
            }
            const ul: HTMLUListElement = document.querySelector<HTMLUListElement>("#keyword-category-multiselect-tags");
            let li: HTMLLIElement = document.createElement("li");
            li.setAttribute("data-term", cat["CategoryTerm"]);
            li.setAttribute("data-name", cat["CategoryName"]);
            li.setAttribute("data-facet-type", "1");
            li.setAttribute("data-location-id", "");
            li.setAttribute("data-latitude", "");
            li.setAttribute("data-longitude", "");
            li.setAttribute("data-location-country-code", "");
            li.setAttribute("data-multiselect-remove-dupes", "true");
            li.setAttribute("data-multiselect-remove-dupes-check-attribute", "data-term");
            li.setAttribute("class", "");
            li.innerText = cat["CategoryName"];
            let a: HTMLAnchorElement = document.createElement("a");
            a.setAttribute("class", "remove-multiselect-tag m-left keyword-remove");
            a.innerText = "Remove Filter";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    static async AddLocations(locs: string){
        let keyArr: Array<string> = locs.split("), ");
        let locArr: Array<Object> = [];
        let count: number = 1;
        for(let key of keyArr){
            let locObj: Object = await this.GetLocation(key.trim(), count);
            locArr.push(locObj);
            count++;
        }
        this.SetLocation(locArr);
    }
    static async GetLocation(key: string, count: number){
        let locs: Array<Object> = await this.FetchData(key.split(" (")[0].split(", ")[0], "Locations");
        if (locs.length < 1){
            if (count < 2){
                this.CreateError("Locations", `No matches found, used ALL keyword`);
                return {
                    "Id": 0,
                    "LocationTerm": "ALL",
                    "LocationName": "ALL",
                    "LocationFacetType": 0,
                    "CustomFacets": [],
                    "DateUpdated": "0001-01-01T00:00:00",
                    "IsInherited": false,
                    "IsOtherThemeKeyword": false,
                    "SiteGroupOrganizations": "",
                    "SiteGroupOrganizationIds": [],
                    "Priority": 0
                }
            }
            else {
                this.CreateError("Locations", `No matches found, skipped ${key}`);
                return null;
            }
        }
        for(let item of locs){
            if (item["LocationName"] == key){
                return item;
            }
        }
        this.CreateError(
            "Locations",
            `No direct match found, used first returned item - ${locs[0]["LocationName"]}`
        )
        return locs[0];
    }
    static SetLocation(locs: Array<Object>){
        for(let loc of locs){
            if (loc == null){
                continue;
            }
            const ul: HTMLUListElement = document.querySelector<HTMLUListElement>("#keyword-location-multiselect-tags");
            let li: HTMLLIElement = document.createElement("li");
            li.setAttribute("data-term", loc["LocationTerm"]);
            li.setAttribute("data-name", loc["LocationName"]);
            li.setAttribute("data-facet-type", "0");
            li.setAttribute("data-location-id", "");
            li.setAttribute("data-latitude", "");
            li.setAttribute("data-longitude", "");
            li.setAttribute("data-location-country-code", "");
            li.setAttribute("data-multiselect-remove-dupes", "true");
            li.setAttribute("data-multiselect-remove-dupes-check-attribute", "data-term");
            li.setAttribute("class", "");
            li.innerText = loc["LocationName"];
            let a: HTMLAnchorElement = document.createElement("a");
            a.setAttribute("class", "remove-multiselect-tag m-left keyword-remove");
            a.innerText = "Remove Filter";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    static async AddFacets(cfs: string){
        let keyArr: Array<string> = cfs.split(", ");
        let cfArr: Array<Object> = [];
        for(let key of keyArr){
            let cfObj: Object = await this.GetFacets(key.trim());
            cfArr.push(cfObj);
        }
        this.SetFacets(cfArr);
    }
    static async GetFacets(key: string){
        let keyPair: Array<string> = key.split(" - ");
        if (key === "ALL"){
            return null;
        }
        let standardFacets: Array<string> = ["Campaign", "Company Name", "Hours Per Week",
        "Industry", "Is Manager", "Is Telecommute", "Job Level", "Job Status", "Job Type",
        "Salary Relocation", "Salary Time", "Travel"]
        for (let item of standardFacets){
            if (item == keyPair[0]){
                keyPair[0] = keyPair[0].toLowerCase().replace(" ", "_");
            }
        }
        let cfs: Array<Object> = await this.FetchData(keyPair[1], "CustomFacets", keyPair[0]);
        if (cfs.length < 1){
            this.CreateError("CustomFacets", `No matches found`);
            return null;
            // {
            //     "Id": 0,
            //     "CustomFacetFieldTerm": "AJDType",
            //     "CustomFacetFieldValue": "Engineer",
            //     "CustomFacets": [],
            //     "DateUpdated": "0001-01-01T00:00:00",
            //     "IsInherited": false,
            //     "IsOtherThemeKeyword": false,
            //     "SiteGroupOrganizations": "",
            //     "SiteGroupOrganizationIds": [],
            //     "Priority": 0
            // }
        }
        for(let item of cfs){
            if (item["CustomFacetFieldTerm"] == keyPair[0]){
                if (item["CustomFacetFieldValue"] == keyPair[1]){
                    return item;
                }
            }
        }
        this.CreateError(
            "CustomFacets",
            `No direct match found, used first returned item - ${cfs[0]["CustomFacetFieldTerm"]} - ${cfs[0]["CustomFacetFieldValue"]}`
        )
        return cfs[0];
    }
    static SetFacets(cfs: Array<Object>){
        for(let cf of cfs){
            if (cf == null){
                continue;
            }
            const ul: HTMLUListElement = document.querySelector<HTMLUListElement>("ul.keyword-facet-value-multiselect-tags.keyword-tags");
            let li: HTMLLIElement = document.createElement("li");
            li.setAttribute("data-term", cf["CustomFacetFieldValue"]);
            li.setAttribute("data-name", cf["CustomFacetFieldValue"]);
            li.setAttribute("data-facet-type", "5");
            li.setAttribute("data-location-id", "");
            li.setAttribute("data-latitude", "");
            li.setAttribute("data-longitude", "");
            li.setAttribute("data-location-country-code", "");
            li.setAttribute("data-multiselect-prepend-text", cf["CustomFacetFieldTerm"]);
            li.setAttribute("data-multiselect-remove-dupes", "true");
            li.setAttribute("data-multiselect-remove-dupes-check-attribute", "data-multiselect-facet-term,data-term");
            li.setAttribute("data-multiselect-facet-name", cf["CustomFacetFieldTerm"]);
            li.setAttribute("data-multiselect-facet-term", cf["CustomFacetFieldTerm"]);
            li.setAttribute("class", "");
            li.innerText = `${cf["CustomFacetFieldTerm"]}, ${cf["CustomFacetFieldValue"]}`;
            let a: HTMLAnchorElement = document.createElement("a");
            a.setAttribute("class", "remove-multiselect-tag m-left keyword-remove");
            a.innerText = "Remove Filter";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    static async FetchData(key: string, type: CallType, cfTerm?: string){
        let cf = cfTerm == null ? "ALL" : cfTerm;
        let body = {
            "appliedKeywords": [],
            "appliedJobTags": [],
            "organizationId": tenantId,
            "tenantId": tenantId,
            "languageCode": langCode,
            "regionSetting": regionSetting,
            "apiVersion": apiVersion,
            "noAllCustomFacetValue": false,
            "noAllTermPair": false,
            "companySiteId": companySiteId,
            "pageType": pageType,
            "removeDuplicatesOnly": false,
            "customFacetFieldTerm": cf,
            "hasCustomFacet": true,
            "requiresPair": true,
            "termPair": null,
            "termCustomFacetFieldNamePair": cf,
            "termCustomFacetFieldValuePair": null,
        };
        return fetch(`https://tbadmin.radancy.net/Keywords/GetAvailable${type}?displayname=${key}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-ch-ua": JSON.stringify(navigator['userAgentData'].brands),
                "sec-ch-ua-mobile": navigator['userAgentData'].mobile.toString(),
                "sec-ch-ua-platform": navigator['userAgentData'].platform,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": window.location.href,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(body),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
        .then((response) => {
            return response.json();
        })
        .catch((e) => {
            console.error(e);
            this.CreateError(type, `API data fetch error - ${e}`);
        });
    }
    static AddTrackingAndURL(item: VanityUrlLegacy){
        const doubleClick: HTMLInputElement = document.querySelector<HTMLInputElement>("#doubleclick-tag");
        const utmSource: HTMLInputElement = document.querySelector<HTMLInputElement>("#utm-source");
        const utmMedium: HTMLInputElement = document.querySelector<HTMLInputElement>("#utm-medium");
        const utmCampaign: HTMLInputElement = document.querySelector<HTMLInputElement>("#utm-campaign");
        const url: HTMLInputElement = document.querySelector<HTMLInputElement>("#keyword-vanity");
        doubleClick.value = item.doubleClick.trim();
        utmSource.value = item.utmSource.trim();
        utmMedium.value = item.utmMedium.trim();
        utmCampaign.value = item.utmCampaign.trim();
        url.value = item.url.trim();
    }
    static AddVanity(){
        const errorText: HTMLSpanElement = document.querySelector<HTMLSpanElement>("span.instruction-text.vanity-url-duplicate");
        const addBtn: HTMLButtonElement = document.querySelector<HTMLButtonElement>("#keyword-vanity-assignment > p > button");
        addBtn.removeAttribute("disabled");
        addBtn.click();
        if (errorText.innerText.length != 0) {
            this.CreateError("NA", "Vanity with this URL already exists!");
            this.CleanVanity();
        }
    }
    static CleanVanity(){
        const categories: HTMLUListElement = document.querySelector<HTMLUListElement>("#keyword-category-multiselect-tags");
        const locations: HTMLUListElement = document.querySelector<HTMLUListElement>("#keyword-location-multiselect-tags");
        const facets: HTMLUListElement = document.querySelector<HTMLUListElement>("ul.keyword-facet-value-multiselect-tags.keyword-tags");
        const doubleClick: HTMLInputElement = document.querySelector<HTMLInputElement>("#doubleclick-tag");
        const utmSource: HTMLInputElement = document.querySelector<HTMLInputElement>("#utm-source");
        const utmMedium: HTMLInputElement = document.querySelector<HTMLInputElement>("#utm-medium");
        const utmCampaign: HTMLInputElement = document.querySelector<HTMLInputElement>("#utm-campaign");
        const url: HTMLInputElement = document.querySelector<HTMLInputElement>("#keyword-vanity");
        categories.childNodes.forEach((child) => {child.remove()});
        locations.childNodes.forEach((child) => {child.remove()});
        facets.childNodes.forEach((child) => {child.remove()});
        doubleClick.value = "";
        utmSource.value = "";
        utmMedium.value = "";
        utmCampaign.value = "";
        url.value = "";
    }
    static EndAlert(){
        window.alert(`Import has ended with ${ImportError.All.length} errors, printed to console`);
        console.log(ImportError.All);
    }
}

function GetVanityData(){
    vanityData = document.querySelector<HTMLDivElement>("#keyword-vanity-assignment");
    organizationId = vanityData.getAttribute("data-organization-id");
    tenantId = vanityData.getAttribute("data-tenant-id");
    apiVersion = vanityData.getAttribute("data-api-version");
    langCode = vanityData.getAttribute("data-language-code");
    companySiteId = vanityData.getAttribute("data-company-site-id");
    pageType = vanityData.getAttribute("data-page-type");
    isDual = vanityData.getAttribute("data-is-dual");
    allowDupes = vanityData.getAttribute("data-allow-duplicates");
    regionSetting = vanityData.getAttribute("data-region-setting");
    authToken = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]').getAttribute("value");
}

chrome.runtime.onConnect.addListener((port) => {
    commsPort = port;
    console.assert(port.name === "content_connect");
    port.onMessage.addListener((msg) => {
        if (msg){
            if ( msg.message == "started" ){
                tabID = msg.tabid;
                if (document.readyState === "complete"){
                    port.postMessage({message: "page load"});
                }
            }
            if ( msg.message == "vanity page loaded" ){
                if ( currentSite == null || currentSite == undefined ){
                    currentSite = document.querySelector('.search-drop').innerHTML;
                    currentSite = urlRegex.exec(currentSite);
                    currentSite = currentSite[1];
                    GetVanityData();
                }
                console.log(`cs sending url - ${currentSite}`);
                let vuList: NodeList = document.querySelectorAll('li.vanity-url');
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
                port.postMessage({message: "uploadLangList", langList: langList});
            }
            if (msg.message == "add"){
                ImportURLs.BeginImport(msg.lang, msg.restrict);
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