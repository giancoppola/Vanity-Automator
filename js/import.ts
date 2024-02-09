import { VanityUrlLegacy, VanityUrl, VanityUrlLists, LangMap } from "../js/types.js";

export class JsonReader{
    static ImportJson(file: File){
        let importObj: string;
        return file.text()
        .then(response => {
            return response;
        })
    }
}