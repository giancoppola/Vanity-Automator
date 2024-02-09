export class JsonReader {
    static ImportJson(file) {
        let importObj;
        return file.text()
            .then(response => {
            return JSON.parse(response);
        });
    }
}
//# sourceMappingURL=import.js.map