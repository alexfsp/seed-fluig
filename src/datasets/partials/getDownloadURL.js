function getDownloadURL(documentId) {
  
  var clientService = fluigAPI.getAuthorizeClientService();
  var data = {
    companyId: getValue("WKCompany") + '',
    serviceCode: 'fluig-post',
    endpoint: '/api/public/2.0/documents/getDownloadURL/' + documentId,
    method: 'get',
    timeoutService: '100',
  }

  var vo = clientService.invoke(JSON.stringify(data));

  return JSON.parse(vo.getResult()).content;

}