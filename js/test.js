async function UpdateVanity(ids, body) {
    let promises = [];
    let preview;
    let rePreview = '.IsPreviewing=(.{4,5})&';
    let unpreview;
    let reUnpreview = '.IsUnpublishingPreview=(.{4,5})&';
    let publish;
    let rePublish = '.IsPublishing=(.{4,5})&';
    let unpublish;
    let reUnpublish = '.IsUnpublishingLive=(.{4,5})&';
    // switch (type) {
    //     case "preview":
    //         preview = "true";
    //         unpreview = "false";
    //         publish = "false";
    //         unpublish = "false";
    //         break;
    //     case "unpreview":
    //         preview = "false";
    //         unpreview = "true";
    //         publish = "false";
    //         unpublish = "false";
    //         break;
    //     case "publish":
    //         preview = "false";
    //         unpreview = "false";
    //         publish = "true";
    //         unpublish = "false";
    //         break;
    //     case "unpublish":
    //         preview = "false";
    //         unpreview = "false";
    //         publish = "false";
    //         unpublish = "true";
    //         break;
    // }
    let uBody = (" " + body).slice(1);
    let re = new RegExp(`(?<=VanitySearchUrls%5B${id[0]}%5D\.IsPreviewing=).{4,5}(?=&)`, 'gm');
    uBody = uBody.replace(re, "true");
    console.log(uBody);
    fetch("https://tbadmin.radancy.net/redirects/savevanitysearchurl", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://tbadmin.radancy.net/redirects/vanitysearchurls/1554/58858",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": uBody,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
        }
    )
    setTimeout(()=>{},5000);
}
let ids = [["", "test"], ["", "test1"]];
function Looper(ids){
    for(id of ids){
        let bodyMid = ``;
        let bodyStart = `SelectedCompanySiteId=58858&OrganizationId=1554&IsNewFullSite=True&ErrorMessage=&LanguageCode=EN&JobCustomFacetField=ALL&KeywordVanity=&DoubleclickTag=&UtmSource=&UtmMedium=&UtmCampaign=`;
        let bodyEnd = `&__RequestVerificationToken=CfDJ8OGhF19QdBxMqro-CfTj-HkzxcEpjuLpVIQRGu3Yvr8CBnIhYpFEpGnRx0KYItKhWwKN515xKHu-OfWiQ3Ea1haPU25pqBXvOluzdLPMNqB0FZF-AYBFhcHIiTBdBzv4AftUtOjGbDjRthn0KpT4IaTscOIJsq9h2HwdiItVniU3Aj6ZTkbL69x2rX47qbkvPg&X-Requested-With=XMLHttpRequest`;
        for(let id of ids){
            let preview = id == ids[1] ? 'true': 'False';
            bodyMid += `&VanitySearchUrls.index=${id[0]}&VanitySearchUrls%5B${id[0]}%5D.IsAdded=True&VanitySearchUrls%5B${id[0]}%5D.IsDeleting=False&VanitySearchUrls%5B${id[0]}%5D.IsPublishing=False&VanitySearchUrls%5B${id[0]}%5D.IsPreviewing=False&VanitySearchUrls%5B${id[0]}%5D.IsUnpublishingLive=False&VanitySearchUrls%5B${id[0]}%5D.IsUnpublishingPreview=False&VanitySearchUrls%5B${id[0]}%5D.VanityUrl=${id[1]}&VanitySearchUrls%5B${id[0]}%5D.LanguageCode=EN&VanitySearchUrls%5B${id[0]}%5D.IsPublished=False&VanitySearchUrls%5B${id[0]}%5D.EntityId=84688&VanitySearchUrls%5B${id[0]}%5D.CategoryName=&VanitySearchUrls%5B${id[0]}%5D.CategoryTerm=&VanitySearchUrls%5B${id[0]}%5D.CategoryFacetType=&VanitySearchUrls%5B${id[0]}%5D.LocationName=&VanitySearchUrls%5B${id[0]}%5D.LocationTerm=&VanitySearchUrls%5B${id[0]}%5D.LocationFacetType=&VanitySearchUrls%5B${id[0]}%5D.CustomFacetFieldName=&VanitySearchUrls%5B${id[0]}%5D.CustomFacetFieldTerm=&VanitySearchUrls%5B${id[0]}%5D.CustomFacetFieldValue=&VanitySearchUrls%5B${id[0]}%5D.NewMultiSelectMappingItem=&VanitySearchUrls%5B${id[0]}%5D.VanitySearchUrlMapping=System.Collections.Generic.List%601%5BTmp.TalentBrew.Admin.Core.Models.VanitySearchUrlMappingModel%5D&VanitySearchUrls%5B${id[0]}%5D.DoubleClickTag=&VanitySearchUrls%5B${id[0]}%5D.UtmSource=&VanitySearchUrls%5B${id[0]}%5D.UtmMedium=&VanitySearchUrls%5B${id[0]}%5D.UtmCampaign=`;
        }
        let body = bodyStart + bodyMid + bodyEnd;
        UpdateVanity(id, body);
        setTimeout(() => {
            //do nothing
        }, 7000);
    }
}
Looper(ids);
