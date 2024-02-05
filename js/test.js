async function UpdateVanity(ids, type) {
    let promises = [];
    let preview;
    let rePreview = '.IsPreviewing=(.*)&';
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
    let bodyMid = ``;
    let bodyStart = `SelectedCompanySiteId=58858&OrganizationId=1554&IsNewFullSite=True&ErrorMessage=&LanguageCode=EN&JobCustomFacetField=ALL&KeywordVanity=&DoubleclickTag=&UtmSource=&UtmMedium=&UtmCampaign=`;
    let bodyEnd = `&__RequestVerificationToken=CfDJ8OGhF19QdBxMqro-CfTj-HlBVexjnDpSbxn6PrtIdrOZouQHSigdtJbm2NQHHWLm0KEi7p7osFawIIt8mfvj52NFo_dHzXLUPSEB3fsLmj07vEUMHQCc-NNMTbonbOBNx3WTos117--u_1SAjmpjU5ICp4-IyRHFINRIBAbx8Kv78_FLWKaOnejkb6eN05mb5w&X-Requested-With=XMLHttpRequest`;
    for(let id of ids){
        bodyMid += `&VanitySearchUrls.index=${id[0]}&VanitySearchUrls%5B${id[0]}%5D.IsAdded=True&VanitySearchUrls%5B${id[0]}%5D.IsDeleting=False&VanitySearchUrls%5B${id[0]}%5D.IsPublishing=False&VanitySearchUrls%5B${id[0]}%5D.IsPreviewing=False&VanitySearchUrls%5B${id[0]}%5D.IsUnpublishingLive=False&VanitySearchUrls%5B${id[0]}%5D.IsUnpublishingPreview=False&VanitySearchUrls%5B${id[0]}%5D.VanityUrl=${id[1]}&VanitySearchUrls%5B${id[0]}%5D.LanguageCode=EN&VanitySearchUrls%5B${id[0]}%5D.IsPublished=False&VanitySearchUrls%5B${id[0]}%5D.EntityId=84688&VanitySearchUrls%5B${id[0]}%5D.CategoryName=&VanitySearchUrls%5B${id[0]}%5D.CategoryTerm=&VanitySearchUrls%5B${id[0]}%5D.CategoryFacetType=&VanitySearchUrls%5B${id[0]}%5D.LocationName=&VanitySearchUrls%5B${id[0]}%5D.LocationTerm=&VanitySearchUrls%5B${id[0]}%5D.LocationFacetType=&VanitySearchUrls%5B${id[0]}%5D.CustomFacetFieldName=&VanitySearchUrls%5B${id[0]}%5D.CustomFacetFieldTerm=&VanitySearchUrls%5B${id[0]}%5D.CustomFacetFieldValue=&VanitySearchUrls%5B${id[0]}%5D.NewMultiSelectMappingItem=&VanitySearchUrls%5B${id[0]}%5D.VanitySearchUrlMapping=System.Collections.Generic.List%601%5BTmp.TalentBrew.Admin.Core.Models.VanitySearchUrlMappingModel%5D&VanitySearchUrls%5B${id[0]}%5D.DoubleClickTag=&VanitySearchUrls%5B${id[0]}%5D.UtmSource=&VanitySearchUrls%5B${id[0]}%5D.UtmMedium=&VanitySearchUrls%5B${id[0]}%5D.UtmCampaign=`;
    }
    let body = bodyStart + bodyMid + bodyEnd;
    for(let id of ids){
        let uBody = (" " + body).slice(1);
        uBody.replace(`VanitySearchUrls%5B${id[0]}%5D`+rePreview, "True");
        console.log(uBody);
        promises.push(fetch("https://tbadmin.radancy.net/redirects/savevanitysearchurl", {
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
        }));
    }
    Promise.all(promises).then((values) => {console.log(values)});
}

let ids = [["ad86ee04-dfbf-4467-9d5c-16bb72a6cafc", "test"], ["ad86ee04-dfbf-4467-9d5c-16bb72a6cafc", "test1"]];

UpdateVanity(ids, 'preview');
