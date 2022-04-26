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
    var abas = Object.keys(contentJSON)
    for (var i in abas) {
        var nomeAba = abas[i];

        var dados = contentJSON[nomeAba];
        if (dados['idPlanilha']) {
            if (dados['idPlanilha'] !== '')
                SS = SpreadsheetApp.openById(dados['idPlanilha'])
        }

        debug('nomeaba: ' + nomeAba + ', dados: ' + JSON.stringify(dados));
        processarDadosAbaPlanilha(nomeAba, dados)
    }

}

function processarDadosAbaPlanilha(nomeAba, dados) {
    debug('inicio processarDadosAbaPlanilha')
    var aba = SS.getSheetByName(nomeAba);
    var cabecalho = null;

    var sobreescrever = true;
    if (dados.hasOwnProperty('sobreescrever'))
        sobreescrever = dados.sobreescrever

    var linha = 1;
    if (dados.hasOwnProperty('linha'))
        linha = dados.linha;

    var coluna = 1;
    if (dados.hasOwnProperty('coluna'))
        coluna = dados.coluna;



    if (aba == null) {
        debug('criando aba: ' + nomeAba)
        aba = SS.insertSheet()
        aba.setName(nomeAba);

        // adicionar cabecalho
        cabecalho = Object.keys(dados.dados[0]);

        var cabecalhoTranspose = [];
        cabecalhoTranspose.push([]);
        for (var i in cabecalho)
            cabecalhoTranspose[0][i] = cabecalho[i];

        debug('cabecalhoTranspose: ' + cabecalhoTranspose + ', cabecalhoTranspose.length: ' + cabecalhoTranspose.length + ', cabecalhoTranspose[0].length: ' + cabecalhoTranspose[0].length)
        aba.getRange(linha, coluna, cabecalhoTranspose.length, cabecalhoTranspose[0].length).setValues(cabecalhoTranspose);
    }

    var colunaFinal = aba.getLastColumn()
    if (dados.hasOwnProperty('colunaFinal'))
        colunaFinal = dados.colunaFinal;


    if (cabecalho == null) {
        try {
            cabecalho = aba.getRange(linha, coluna, 1, colunaFinal).getValues()[0];
            if (sobreescrever)
                aba.getRange(linha + 1, coluna, aba.getLastRow(), colunaFinal).clearContent();
        } catch { }
    }

    if (cabecalho.length > 0) {
        debug('cabecalho: ' + cabecalho)
        var registros = tableJsonToArray(dados.dados, cabecalho);
        if (registros.length > 0) {
            debug('registros.length: ' + registros.length)

            var linhaDados = linha + 1;
            if (!sobreescrever)
                linhaDados = aba.getLastRow() + 1;

            aba.getRange(linhaDados, coluna).offset(0, 0, registros.length, registros[0].length).setValues(registros);
        }
    }
    debug('fim processarDadosAbaPlanilha')
}


