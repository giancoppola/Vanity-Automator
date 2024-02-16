var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
let vanityData;
let organizationId;
let companySiteId; // current site id
let tenantId; // current client id
let authToken; // auth token for requests
let langCode;
let regionSetting;
let pageType;
let apiVersion;
let isDual;
let allowDupes;
class Tools {
    static CapitaliseFirstLetters(str) {
        let res;
        let arr = str.split(" ");
        for (let item of arr) {
            item[0].toUpperCase();
        }
        res = arr.join(" ");
        return res;
    }
}
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
VanityUrl.Count = 1;
class VanityUrlLegacy {
    constructor(url, facets, categories, locations, doubleClick, utmSource, utmMedium, utmCampaign, isLive) {
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
VanityUrlLegacy.Count = 1;
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
        let vu = new VanityUrlLegacy(url.trim(), facets.trim(), categories.trim(), locations.trim(), doubleClick.trim(), utmSource.trim(), utmMedium.trim(), utmCampaign.trim(), isLive);
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
        let vu = new VanityUrl(url.trim(), stageBtn, prodBtn, lang.trim(), id.trim(), facets.trim(), categories.trim(), locations.trim(), doubleClick.trim(), utmSource.trim(), utmMedium.trim(), utmCampaign.trim());
        vuArr.push(vu);
    }
    vuLists = new VanityUrlLists(vuArr);
}
function AlertWindow(msg) {
    alert(msg);
}
class ImportError {
    constructor(intId, errorCategory, errorValues, errorURL, errorLang, errorMsg) {
        this.intId = intId;
        this.errorCategory = errorCategory;
        this.errorValues = errorValues;
        this.errorURL = errorURL;
        this.errorLang = errorLang;
        this.errorMsg = errorMsg;
    }
}
ImportError.Urls = [];
ImportError.Langs = [];
ImportError.All = [];
ImportError.Log = {};
class ImportURLs {
    static BeginImport(langs, restrict) {
        return __awaiter(this, void 0, void 0, function* () {
            ImportError.Langs = langs;
            let opt = document.querySelector("select#language-code");
            for (let lang of langs) {
                console.log(`now starting import, using ${lang} language`);
                opt.value = lang;
                let count = 0;
                if (parseInt(restrict) > 0) {
                    for (let item of importObj) {
                        if (count <= parseInt(restrict)) {
                            ImportURLs.Lang = lang;
                            ImportURLs.Current = item;
                            yield this.AddCategories(item.categories);
                            yield this.AddLocations(item.locations);
                            yield this.AddFacets(item.facets);
                            yield this.AddTrackingAndURL(item);
                            yield this.AddVanity();
                            count++;
                        }
                    }
                }
                else {
                    for (let item of importObj) {
                        ImportURLs.Lang = lang;
                        ImportURLs.Current = item;
                        yield this.AddCategories(item.categories);
                        yield this.AddLocations(item.locations);
                        yield this.AddFacets(item.facets);
                        yield this.AddTrackingAndURL(item);
                        yield this.AddVanity();
                        count++;
                    }
                }
            }
            this.EndAlert();
        });
    }
    static CreateError(type, value, msg) {
        let error = new ImportError(ImportURLs.Current.intId, type, value, ImportURLs.Current.url, ImportURLs.Lang, msg);
        // Deep copy of string in case its retaining reference
        let lang = (' ' + this.Lang).slice(1);
        let url = (' ' + this.Current.url).slice(1);
        // if property in object didn't work, kept overwriting old values, but hasOwnProperty works
        if (ImportError.Log.hasOwnProperty(lang)) {
            if (!(ImportError.Log[lang].hasOwnProperty(url))) {
                ImportError.Log[lang][url] = [];
            }
        }
        else {
            ImportError.Log[lang] = {};
            if (!(ImportError.Log[lang].hasOwnProperty(url))) {
                ImportError.Log[lang][url] = [];
            }
        }
        ImportError.Log[lang][url].push(error);
        ImportError.Urls.push(ImportURLs.Current.url);
        ImportError.All.push(error);
    }
    static AddCategories(cats) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyArr = cats.split(", ");
            let catArr = [];
            let count = 1;
            for (let key of keyArr) {
                let catObj = yield this.GetCategory(key.trim(), count);
                catArr.push(catObj);
                count++;
            }
            this.SetCategory(catArr);
        });
    }
    static GetCategory(key, count) {
        return __awaiter(this, void 0, void 0, function* () {
            let cats = yield this.FetchData(key, "Categories");
            if (cats.length < 1) {
                if (count < 2) {
                    this.CreateError("Categories", key, `No matches found, used ALL keyword`);
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
                    };
                }
                else {
                    this.CreateError("Categories", key, `No matches found, skipped ${key}`);
                    return null;
                }
            }
            for (let item of cats) {
                if (item["CategoryName"] == key) {
                    return item;
                }
            }
            this.CreateError("Categories", key, `No direct match found, used first returned item - ${cats[0]["CategoryName"]}`);
            return cats[0];
        });
    }
    static SetCategory(cats) {
        for (let cat of cats) {
            if (cat == null) {
                continue;
            }
            const ul = document.querySelector("#keyword-category-multiselect-tags");
            let li = document.createElement("li");
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
            let a = document.createElement("a");
            a.setAttribute("class", "remove-multiselect-tag m-left keyword-remove");
            a.innerText = "Remove Filter";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    static AddLocations(locs) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyArr = locs.split("), ");
            let locArr = [];
            let count = 1;
            for (let key of keyArr) {
                let locObj = yield this.GetLocation(key.trim(), count);
                locArr.push(locObj);
                count++;
            }
            this.SetLocation(locArr);
        });
    }
    static GetLocation(key, count) {
        return __awaiter(this, void 0, void 0, function* () {
            let locs = yield this.FetchData(key.split(" (")[0].split(", ")[0], "Locations");
            if (locs.length < 1) {
                if (count < 2) {
                    this.CreateError("Locations", key, `No matches found, used ALL keyword`);
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
                    };
                }
                else {
                    this.CreateError("Locations", key, `No matches found, skipped ${key}`);
                    return null;
                }
            }
            for (let item of locs) {
                if (item["LocationName"] == key) {
                    return item;
                }
            }
            this.CreateError("Locations", key, `No direct match found, used first returned item - ${locs[0]["LocationName"]}`);
            return locs[0];
        });
    }
    static SetLocation(locs) {
        for (let loc of locs) {
            if (loc == null) {
                continue;
            }
            const ul = document.querySelector("#keyword-location-multiselect-tags");
            let li = document.createElement("li");
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
            let a = document.createElement("a");
            a.setAttribute("class", "remove-multiselect-tag m-left keyword-remove");
            a.innerText = "Remove Filter";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    static AddFacets(cfs) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyArr = cfs.split(", ");
            let cfArr = [];
            for (let key of keyArr) {
                let cfObj = yield this.GetFacets(key.trim());
                cfArr.push(cfObj);
            }
            this.SetFacets(cfArr);
        });
    }
    static GetFacets(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyPair = key.split(" - ");
            if (key === "ALL") {
                return null;
            }
            let standardFacets = ["Campaign", "Company Name", "Hours Per Week",
                "Industry", "Is Manager", "Is Telecommute", "Job Level", "Job Status", "Job Type",
                "Salary Relocation", "Salary Time", "Travel"];
            for (let item of standardFacets) {
                if (item == keyPair[0]) {
                    keyPair[0] = keyPair[0].toLowerCase().replace(" ", "_");
                }
            }
            let cfs = yield this.FetchData(keyPair[1], "CustomFacets", keyPair[0]);
            if (cfs.length < 1) {
                this.CreateError("CustomFacets", key, `No matches found`);
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
            for (let item of cfs) {
                if (item["CustomFacetFieldTerm"] == keyPair[0]) {
                    if (item["CustomFacetFieldValue"] == keyPair[1]) {
                        return item;
                    }
                }
            }
            this.CreateError("CustomFacets", key, `No direct match found, used first returned item - ${cfs[0]["CustomFacetFieldTerm"]} - ${cfs[0]["CustomFacetFieldValue"]}`);
            return cfs[0];
        });
    }
    static SetFacets(cfs) {
        for (let cf of cfs) {
            if (cf == null) {
                continue;
            }
            const ul = document.querySelector("ul.keyword-facet-value-multiselect-tags.keyword-tags");
            let li = document.createElement("li");
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
            let a = document.createElement("a");
            a.setAttribute("class", "remove-multiselect-tag m-left keyword-remove");
            a.innerText = "Remove Filter";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    static FetchData(key, type, cfTerm) {
        return __awaiter(this, void 0, void 0, function* () {
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
                this.CreateError(type, key, `API data fetch error - ${e}`);
            });
        });
    }
    static AddTrackingAndURL(item) {
        const doubleClick = document.querySelector("#doubleclick-tag");
        const utmSource = document.querySelector("#utm-source");
        const utmMedium = document.querySelector("#utm-medium");
        const utmCampaign = document.querySelector("#utm-campaign");
        const url = document.querySelector("#keyword-vanity");
        doubleClick.value = item.doubleClick.trim();
        utmSource.value = item.utmSource.trim();
        utmMedium.value = item.utmMedium.trim();
        utmCampaign.value = item.utmCampaign.trim();
        let urlRe = new RegExp(/@|,|\.|;|\||\\|€|£|#|\$|%|\^|&|\*|\(|\)|_|=|\+|\{|\[|\}|]|\||\'|\"|\:|\?|\/|\>|<|`|~| /g);
        let urlValue = item.url.replace(urlRe, "-").trim().substring(0, 99);
        url.value = urlValue; // URL must be 100 characters or less
    }
    static AddVanity() {
        const errorText = document.querySelector("span.instruction-text.vanity-url-duplicate");
        const addBtn = document.querySelector("#keyword-vanity-assignment > p > button");
        addBtn.removeAttribute("disabled");
        addBtn.click();
        if (errorText.innerText.length != 0) {
            this.CreateError("NA", ImportURLs.Current.url, errorText.innerText);
            this.CleanVanity();
            errorText.innerText = "";
            addBtn.removeAttribute("disabled");
        }
    }
    static CleanVanity() {
        const categories = document.querySelector("#keyword-category-multiselect-tags");
        const locations = document.querySelector("#keyword-location-multiselect-tags");
        const facets = document.querySelector("ul.keyword-facet-value-multiselect-tags.keyword-tags");
        const doubleClick = document.querySelector("#doubleclick-tag");
        const utmSource = document.querySelector("#utm-source");
        const utmMedium = document.querySelector("#utm-medium");
        const utmCampaign = document.querySelector("#utm-campaign");
        const url = document.querySelector("#keyword-vanity");
        categories.childNodes.forEach((child) => { child.remove(); });
        locations.childNodes.forEach((child) => { child.remove(); });
        facets.childNodes.forEach((child) => { child.remove(); });
        doubleClick.value = "";
        utmSource.value = "";
        utmMedium.value = "";
        utmCampaign.value = "";
        url.value = "";
        url.classList.remove("vanity-url-error"); // Won't properly reset without this
    }
    static EndAlert() {
        let urlCount = Array.from(new Set(ImportError.Urls)).length;
        let langCount = ImportError.Langs.length;
        let urlPlural = urlCount > 1 ? "s" : "";
        let langPlural = langCount > 1 ? "s" : "";
        window.alert(`Import has completed - there are ${urlCount} URL${urlPlural} with issues, across ${langCount} language${langPlural} - please open the developer console to view`);
        console.log(`%c Import Errors Logged Below \\/`, 'background: #6f00ef; color: #fff');
        console.log(ImportError.Log);
        console.log(`%c Unsorted Errors Below \\/`, 'background: #6f00ef; color: #fff');
        console.log(ImportError.All);
    }
}
function GetVanityData() {
    vanityData = document.querySelector("#keyword-vanity-assignment");
    organizationId = vanityData.getAttribute("data-organization-id");
    tenantId = vanityData.getAttribute("data-tenant-id");
    apiVersion = vanityData.getAttribute("data-api-version");
    langCode = vanityData.getAttribute("data-language-code");
    companySiteId = vanityData.getAttribute("data-company-site-id");
    pageType = vanityData.getAttribute("data-page-type");
    isDual = vanityData.getAttribute("data-is-dual");
    allowDupes = vanityData.getAttribute("data-allow-duplicates");
    regionSetting = vanityData.getAttribute("data-region-setting");
    authToken = document.querySelector('input[name="__RequestVerificationToken"]').getAttribute("value");
}
chrome.runtime.onConnect.addListener((port) => {
    commsPort = port;
    console.assert(port.name === "content_connect");
    port.onMessage.addListener((msg) => {
        if (msg) {
            if (msg.message == "started") {
                tabID = msg.tabid;
                if (document.readyState === "complete") {
                    port.postMessage({ message: "page load" });
                }
            }
            if (msg.message == "vanity page loaded") {
                if (currentSite == null || currentSite == undefined) {
                    currentSite = document.querySelector('.search-drop').innerHTML;
                    currentSite = urlRegex.exec(currentSite);
                    currentSite = currentSite[1];
                    GetVanityData();
                }
                console.log(`cs sending url - ${currentSite}`);
                let vuList = document.querySelectorAll('li.vanity-url');
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
                port.postMessage({ message: "uploadLangList", langList: langList });
            }
            if (msg.message == "add") {
                ImportURLs.BeginImport(msg.lang, msg.restrict);
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