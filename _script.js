const ID_SCRIPT_CACHE = '_skyscripts-indicadores';
const ID_PASTA_SCRIPTS_GDRIVE = '1HZtn_H7CGqmAeV2jBFiJZBKhFVQiF1S4';

var transmitterParametros = {
    parametros: null
}

function obterScript() {
    var scriptText = obterScriptServidor();
    if (scriptText) {
        return scriptText
    } else {
        return false
    };
}

function obterScriptServidor() {
    var scriptText = obterScriptCache();
    if (scriptText) {
        return scriptText;
    } else {
        try {
            scriptText = "";
            var folder = DriveApp.getFolderById(ID_PASTA_SCRIPTS_GDRIVE);
            var files = folder.getFiles();
            while (files.hasNext()) {
                var file = files.next();
                scriptText += file.getBlob().getDataAsString();
            }
        } catch (error) {
            return false
        }
        armazenarScriptCache(scriptText);
    }
    return scriptText;
}

function armazenarScriptCache(data) {
    var cache = CacheService.getScriptCache()
    var chunky = chunkSubstr(data, 1024 * 90)
    for (var i = 0; i < chunky.length; i++) {
        cache.put(i + ID_SCRIPT_CACHE, chunky[i])
    }
}

function obterScriptCache() {
    var cache = CacheService.getScriptCache()
    var i = 0
    var scriptText = '';
    while (true) {
        var content = cache.get(i + ID_SCRIPT_CACHE);
        if (!content) {
            break
        } else {
            scriptText += content;
            i++;
        }
    }
    return scriptText;
}

function limparScriptCache() {
    var cache = CacheService.getScriptCache()
    for (var i = 0; i < 10; i++) {
        var content = cache.remove(i + ID_SCRIPT_CACHE);
    }
}

function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
    for (var i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }
    return chunks
}

function execFuncParam(functionName, parametros) {
    if (functionName != '') {
        eval(obterScript());
        transmitterParametros.parametros = parametros;
        eval(functionName + "()");
    }
}
