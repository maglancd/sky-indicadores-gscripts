function clearDebug() {
    if (sheetDebug != null) {
        sheetDebug.clearContents();
    }
}

function debug(message) {
    if (sheetDebug != null) {
        sheetDebug.appendRow([message])
    }
    Logger.log(message)
}