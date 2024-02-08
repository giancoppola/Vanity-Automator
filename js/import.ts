import { VanityUrlLegacy, VanityUrl, VanityUrlLists, LangMap } from "../js/types.js";
export function ImportJson(file: File){
    let uploadObj: Array<VanityUrlLegacy>;
    file.text()
    .then(response => {
        console.log(response)
        uploadObj = JSON.parse(response);
        console.log(uploadObj)
        for(let item of uploadObj){
            console.log(item);
        }
    });
}

class JsonReader{
    static ToVanityUrls(obj: Object){
        
    }
}