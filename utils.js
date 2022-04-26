function tableJsonToArray(object, header) {
    const result = []
    let obj_keys = []
    if (header) {
        obj_keys = header
    } else {
        obj_keys = Object.keys(object[0])
    }

    for (const i in object) {
        if (Object.hasOwnProperty.call(object, i)) {
            const row = []
            for (const j in obj_keys) {
                if (Object.hasOwnProperty.call(obj_keys, j)) {
                    row.push(object[i][obj_keys[j]])
                } else {
                    row.push("");
                }
            }
            result.push(row)
        }
    }
    return result
}

function arrayTranspose(data) {
    //https://gist.github.com/jalcantarab/0eb43b13c97e4f784bd0be327f6ced52
    if (data.length == 0 || data[0].length == 0) {
        return null;
    }
    var ret = [];
    for (var i = 0; i < data[0].length; ++i) {
        ret.push([]);
    }

    for (var i = 0; i < data.length; ++i) {
        for (var j = 0; j < data[i].length; ++j) {
            ret[j][i] = data[i][j];
        }
    }
    return ret;
}



