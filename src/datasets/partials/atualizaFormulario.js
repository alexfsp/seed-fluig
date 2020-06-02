function atualizaFormulario(empresa, usuario, senha, documentid, campos) {

  var cardServiceProvider = ServiceManager.getServiceInstance("ECMCardService");
  var cardServiceLocator = cardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMCardServiceService");
  var cardService = cardServiceLocator.getCardServicePort();
  var cardFieldDtoArray = cardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDtoArray");

  let sequence = 0;

  // log.info('antes updateCardData. documentid: ' + documentid);

  campos.forEach(campo => {
    let cardField = cardServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");

    // log.info(campo.name);
    // log.info(campo.value);

    cardField.setField(String(campo.name));
    cardField.setValue(String(campo.value || ''));
    cardFieldDtoArray.getItem()
      .add(sequence, cardField);

    sequence++;
  });


  cardService.updateCardData(empresa, usuario, senha, documentid, cardFieldDtoArray);

  // log.info('depois updateCardData');

}
