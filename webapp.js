function processarJSON(contentJSON) {

    /*
      { "escrituras": {
          "sobreescrever": true,
          "linha": 2,
          "coluna": 1,
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
       } 
     }
     */
    clearDebug();
    contentJSON = transmitterParametros.parametros
    if (contentJSON.hasOwnProperty('idArquivoPlanilha')) {
        if (contentJSON['idArquivoPlanilha'] !== '')
            SS = SpreadsheetApp.openById(contentJSON['idArquivoPlanilha'])
    }

    if (contentJSON.hasOwnProperty('planihas'))
        for (var i in contentJSON.planilhas) {
            var dados = contentJSON.planilhas[i];

            if (dados.hasOwnProperty('idArquivoPlanilha')) {
                if (dados['idArquivoPlanilha'] !== '')
                    SS = SpreadsheetApp.openById(dados['idArquivoPlanilha'])
            }

            debug('dados: ' + JSON.stringify(dados));
            processarDadosAbaPlanilha(dados)
        }

}

function processarDadosAbaPlanilha(dados) {
    debug('inicio processarDadosAbaPlanilha')

    var cabecalho = null;

    var sobrescrever = true;
    if (dados.hasOwnProperty('sobrescrever'))
        sobrescrever = dados.sobreescrever

    var linha = 1;
    if (dados.hasOwnProperty('linha'))
        linha = dados.linha;

    var coluna = 1;
    if (dados.hasOwnProperty('coluna'))
        coluna = dados.coluna;


    if (dados.dados.length > 0) {

        var aba = SS.getSheetByName(dados.nomeAba);
        if (aba == null) {
            debug('criando aba: ' + dados.nomeAba)
            aba = SS.insertSheet()
            aba.setName(dados.nomeAba);

            // adicionar cabecalho
            cabecalho = Object.keys(dados.dados[0]);

            var cabecalhoTranspose = [];
            cabecalhoTranspose.push([]);
            for (var i in cabecalho)
                cabecalhoTranspose[0][i] = cabecalho[i];

            debug('cabecalhoTranspose: ' + cabecalhoTranspose + ', cabecalhoTranspose.length: ' + cabecalhoTranspose.length + ', cabecalhoTranspose[0].length: ' + cabecalhoTranspose[0].length)
            aba.getRange(linha, coluna).offset(0, 0, cabecalhoTranspose.length, cabecalhoTranspose[0].length).setValues(cabecalhoTranspose);
        }

        var colunaFinal = dados.getLastColumn()
        if (dados.hasOwnProperty('colunaFinal'))
            colunaFinal = dados.colunaFinal;


        if (cabecalho == null) {
            try {
                cabecalho = aba.getRange(linha, coluna, 1, colunaFinal).getValues()[0];
                if (sobrescrever)
                    aba.getRange(linha + 1, coluna, dados.getLastRow(), colunaFinal).clearContent();
            } catch { }
        }

        if (cabecalho.length > 0) {
            debug('cabecalho: ' + cabecalho)
            var registros = tableJsonToArray(dados.dados, cabecalho);
            if (registros.length > 0) {
                debug('registros.length: ' + registros.length)

                var linhaDados = linha + 1;
                if (!sobrescrever)
                    linhaDados = dados.getLastRow() + 1;

                aba.getRange(linhaDados, coluna).offset(0, 0, registros.length, registros[0].length).setValues(registros);
            }
        }
    }
    debug('fim processarDadosAbaPlanilha')
}


