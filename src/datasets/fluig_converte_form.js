function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
  var codDoctoPai = 102413;
  var codEmpresa = 1;
  var altera = false;

  var dataset = DatasetBuilder.newDataset();

  var campos = ['cod_empresa', 'nr_documento', 'nr_versao', 'num_docto_propried', 'num_vers_propried', 'versao_ativa', 'tp_documento'];

  campos.forEach(function (campo) {
    dataset.addColumn(campo);
  });
  dataset.addColumn('new_version');

  var documentoPai = executaSql("SELECT * FROM documento WHERE nr_documento = " + codDoctoPai + " and versao_ativa = 1 and cod_empresa = " + codEmpresa + " ", 'query', campos, '/jdbc/FluigDS');

  var versaoAtiva = documentoPai[0].nr_versao;

  var Documentos = executaSql("SELECT * FROM documento WHERE num_docto_propried = " + codDoctoPai + " and versao_ativa = 1 and tp_documento = 5 and cod_empresa = " + codEmpresa + " ", 'query', campos, '/jdbc/FluigDS');
  // var Documentos = executaSql("SELECT * FROM documento WHERE nr_documento = 128255 and versao_ativa = 1 and tp_documento = 5 and cod_empresa = " + codEmpresa + " ", 'query', campos, '/jdbc/FluigDS');
  log.info(Documentos)
  Documentos.forEach(function (documento) {
    log.info(documento.num_vers_propried);
    log.info(versaoAtiva);
    if (documento.num_vers_propried != versaoAtiva) {
      var row = new Array();
      campos.forEach(function (campo) {
        row.push(String(documento[campo]));
      });
      row.push(String(versaoAtiva));

      dataset.addRow(row);

      if (altera) {

        executaSql("UPDATE documento SET num_vers_propried = " + versaoAtiva + " WHERE cod_empresa = " + documento.cod_empresa + " and nr_documento = " + documento.nr_documento + " and nr_versao = " + documento.nr_versao, 'update', null, '/jdbc/FluigDS');

      }
    }
  });

  return dataset;

}

function onMobileSync(user) {

}

/*$$ partials/executaSql.js $$*/
