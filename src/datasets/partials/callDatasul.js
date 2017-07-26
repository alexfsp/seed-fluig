function callDatasul(programa, metodo, json, tenantId) {

  log.info(">>>>>> tenantId: " + tenantId);

  const serviceProvider = ServiceManager.getService('WSEXECBO');
  const serviceLocator = serviceProvider.instantiate('com.totvs.framework.ws.execbo.service.WebServiceExecBO');
  const service = serviceLocator.getWebServiceExecBOPort();

  json.ttParam[0].tmpField = '';

  const input = {
    dsInput: json
  };

  const params = [{
    dataType: 'longchar',
    name: 'wsInput',
    value: JSON.stringify(input),
    type: 'input'
  }, {
    dataType: 'longchar',
    name: 'wsOutput',
    value: '',
    type: 'output'
  }];

  const jsonParams = JSON.stringify(params);

  const token = service.userLogin('super');

  let resp;

  if (tenantId) {
    resp = service.callProcedureWithTokenAndCompany(token, tenantId, programa, metodo, jsonParams);
  } else {
    resp = service.callProcedureWithToken(token, programa, metodo, jsonParams);
  }

  log.info(`Retorno callDatasul: ${resp}`);

  // Converte o resultado para um objeto
  const respObj = JSON.parse(resp);
  const value = respObj[0].value != '' ? JSON.parse(respObj[0].value) : '';

  return value.dsOutput || value;
}
