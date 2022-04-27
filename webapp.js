function processarJSON(contentJSON) {

    /*
    {   "usarScriptCache": false,    
        "idArquivoPlanilha": "",
        "planilhas": [{ 
            "idArquivoPlanilha": "1CUQ5ipCY1YipSBRlqiE_3bNnHwKRg7w77H-tpZpN76w",  
            "nomePlanilha": "escrituras",      
            "sobrescrever": false,
            "linha": 1,
            "coluna": 1,
            "colunaFinal": 3,
            "dados": [{
                "mes": "janeiro",
                "ano": "2020",
                "quantidade": "5",
                "categoria": "inventario"
            }, {
                "mes": "fevereiro",
                "ano": "2020",
                "quantidade": "15",
                "categoria": "compra e venda"
            }]
        }] 
        }
     */

    contentJSON = transmitterParametros.parametros
    if (contentJSON.hasOwnProperty('idArquivoPlanilha')) {
        if (contentJSON['idArquivoPlanilha'] !== '')
            SS = SpreadsheetApp.openById(contentJSON['idArquivoPlanilha'])
    }

    if (contentJSON.hasOwnProperty('planilhas'))
        for (var i in contentJSON.planilhas) {
            var dados = contentJSON.planilhas[i];

            if (dados.hasOwnProperty('idArquivoPlanilha')) {
                if (dados['idArquivoPlanilha'] !== '')
                    SS = SpreadsheetApp.openById(dados['idArquivoPlanilha'])

            }
            clearDebug();
            debug('dados: ' + JSON.stringify(dados));
            processarDadosAbaPlanilha(dados)
        }

}

function processarDadosAbaPlanilha(dados) {
    debug('inicio processarDadosAbaPlanilha')

    var cabecalho = null;

    var sobrescrever = true;
    if (dados.hasOwnProperty('sobrescrever'))
        sobrescrever = dados.sobrescrever

    var linha = 1;
    if (dados.hasOwnProperty('linha'))
        linha = dados.linha;

    var coluna = 1;
    if (dados.hasOwnProperty('coluna'))
        coluna = dados.coluna;


    if (dados.dados.length > 0) {

        var aba = SS.getSheetByName(dados.nomePlanilha);
        if (aba == null) {
            debug('criando aba: ' + dados.nomePlanilha)
            aba = SS.insertSheet()
            aba.setName(dados.nomePlanilha);

            // adicionar cabecalho
            cabecalho = Object.keys(dados.dados[0]);

            var cabecalhoTranspose = [];
            cabecalhoTranspose.push([]);
            for (var i in cabecalho)
                cabecalhoTranspose[0][i] = cabecalho[i];

            debug('cabecalhoTranspose: ' + cabecalhoTranspose + ', cabecalhoTranspose.length: ' + cabecalhoTranspose.length + ', cabecalhoTranspose[0].length: ' + cabecalhoTranspose[0].length)
            aba.getRange(linha, coluna).offset(0, 0, cabecalhoTranspose.length, cabecalhoTranspose[0].length).setValues(cabecalhoTranspose);
        }

        var colunaFinal = aba.getLastColumn()
        if (dados.hasOwnProperty('qtdeColunas'))
            colunaFinal = coluna + dados.qtdeColunas - 1;

        var linhaFinal = aba.getLastRow();
        var linhaFinalMaxima = -1;
        if (dados.hasOwnProperty('qtdeLinhas')) {
            linhaFinalMaxima = linha + dados.qtdeLinhas - 1;
            if (linhaFinal > linhaFinalMaxima)
                linhaFinal = linhaFinalMaxima;
        }

        if (cabecalho == null) {
            try {
                cabecalho = aba.getRange(linha, coluna, 1, colunaFinal).getValues()[0];
                if (sobrescrever)
                    aba.getRange(linha + 1, coluna, linhaFinal, colunaFinal).clearContent();
            } catch { }
        }

        if (cabecalho.length > 0) {
            debug('cabecalho: ' + cabecalho)
            var registros = tableJsonToArray(dados.dados, cabecalho);
            if (registros.length > 0) {

                debug('registros.length: ' + registros.length)
                var linhaInicialDados = linha + 1;
                if (!sobrescrever)
                    linhaInicialDados = linhaFinal + 1;

                var qtdeRegistros = registros.length;
                if (linhaFinalMaxima > 0) {
                    debug('linhaFinalMaxima: ' + linhaFinalMaxima)
                    if (linhaInicialDados > linhaFinalMaxima) {
                        qtdeRegistros = 0;
                    } else {
                        qtdeRegistros = linhaFinalMaxima - linhaInicialDados + 1;
                    }
                    debug('qtdeRegistros: ' + qtdeRegistros)
                }

                if (qtdeRegistros > 0) {
                    if (registros.length > qtdeRegistros) {
                        debug('registros.length > qtdeRegistros')
                        registros = registros.slice(0, qtdeRegistros)
                    }
                    debug('setValues(): linhaInicialDados: ' + linhaInicialDados + ', coluna: ' + coluna + ', registros.length: ' + registros.length)
                    aba.getRange(linhaInicialDados, coluna).offset(0, 0, registros.length, registros[0].length).setValues(registros);
                }
            }
        }
    }
    debug('fim processarDadosAbaPlanilha')
}


