function jsonFromCsv(documentId, url) {

  let downloadUrl;

  if (url) {
    downloadUrl = url
  } else {
    const documentService = fluigAPI.getDocumentService();

    downloadUrl = documentService.getDownloadURL(Number(documentId));
  }

  let scanner = new java.util.Scanner(new java.net.URL(downloadUrl).openStream(), java.nio.charset.StandardCharsets.ISO_8859_1.toString())

  let DatasetSap = [];
  let i = 0;
  let columns = {};

  while (scanner.hasNextLine()) {
    i++;
    let nextLine = String(scanner.nextLine());

    let registro = nextLine.split(';');

    if (i == 1) {
      for (var col = 0; col < registro.length; col++) {
        columns[String(registro[col]).trim()] = col ? col : 0;
      }
    } else {
      let obj = {};
      camposLayout.forEach(c => {
        obj[c] = String(registro[columns[c]]).trim();
      });
      tables.forEach(t => {
        t.fields.forEach(tField => {
          let i = 1;
          let c = tField + '___' + i;
          do {
            obj[c] = String(registro[columns[c]]).trim();
            camposLayout.push(c);
            i++;
            c = tField + '___' + i
          }
          while (columns[c] != null);
        })
      })
      DatasetSap.push(obj)
    }
  }

  return DatasetSap;
}