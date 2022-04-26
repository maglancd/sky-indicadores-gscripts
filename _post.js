function doPost(e) {
    try {
        const content = e.postData.contents;
        const contentJSON = JSON.parse(content);

        if (contentJSON.hasOwnProperty('usarScriptCache')) {
            if (!contentJSON.usarScriptCache) {
                limparScriptCache();
            }
        }

        execFuncParam('processarJSON', contentJSON);
        return sendJSON(JSON.stringify({ status: 200, message: "Processado", content: JSON.stringify(e) }))
    } catch (ex) {
        return sendJSON(JSON.stringify({ status: 500, message: "Erro ao processar a requisicao", exception: ex.message, content: JSON.stringify(e) }))
    }
}

function sendJSON(response) {
    return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
}