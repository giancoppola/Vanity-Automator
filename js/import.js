export function ImportJson(file) {
    let uploadObj;
    file.text()
        .then(response => {
        console.log(response);
        uploadObj = JSON.parse(response);
        console.log(uploadObj);
        for (let item of uploadObj) {
            console.log(item);
        }
    });
}
//# sourceMappingURL=import.js.map