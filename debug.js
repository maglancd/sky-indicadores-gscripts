function clearDebug() {
    var sheetDebug = SS.getSheetByName('debug');
    if (sheetDebug != null) {
        sheetDebug.clearContents();
    }
}

function debug(message) {
    var sheetDebug = SS.getSheetByName('debug');
    if (sheetDebug != null) {
        sheetDebug.appendRow([message])
    }
    Logger.log(message)
}