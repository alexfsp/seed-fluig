function montaDataset(erro, json, campos, display, dePara) {
  const dataset = DatasetBuilder.newDataset();
  if (!dePara) dePara = campos;

  if (erro) {
    dataset.addColumn('erro');
    for (var i = 0; i < erro.length; i++) {
      dataset.addRow([erro[i].mensagem]);
    }
    return dataset;
  }

  if (!json) {
    return dataset;
  }

  for (var i = 0; i < dePara.length; i++) {
    dataset.addColumn(dePara[i]);
  }

  dataset.addColumn('displaykey');

  let row;
  for (var i = 0; i < json.length; i++) {
    row = [];
    for (let c = 0; c < dePara.length; c++) {
      row[c] = String(json[i][campos[c]]);
    }

    // último campo é o campo de display, utilizado em zoom e autocomplete
    row[campos.length] = '';
    for (let d = 0; d < display.length; d++) {
      row[campos.length] += json[i][display[d]];
      if (d < display.length - 1) row[campos.length] += ' - ';
    }

    dataset.addRow(row);
  }
  return dataset;
}
