function createDocument(usuarioFluig, senhaFLuig, parentDocumentId, fileName, description, bytes) {

  var webServiceProvider = ServiceManager.getServiceInstance("ECMDocumentService");
  var webServiceLocator = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService");
  var webService = webServiceLocator.getDocumentServicePort();
  var documentoArray = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDtoArray");
  var documento = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.DocumentDto");

  documento.setAtualizationId(1);
  documento.setColleagueId('adm');
  documento.setCompanyId('1');
  documento.setDocumentDescription(description);
  documento.setDocumentType("2");
  documento.setDownloadEnabled(true);
  documento.setInheritSecurity(true);
  documento.setParentDocumentId(parentDocumentId);
  documento.setPublisherId('adm');
  documento.setUpdateIsoProperties(true);
  documento.setUserNotify(false);
  documento.setVersionOption("0");
  documento.setDocumentPropertyNumber(0);
  documento.setDocumentPropertyVersion(0);
  documento.setVolumeId("Default");
  documento.setLanguageId("pt");
  documento.setIndexed(true);//o default era false
  documento.setActiveVersion(true);
  documento.setTopicId(56);
  documento.setDocumentTypeId("");
  documento.setExternalDocumentId("");
  documento.setDatasetName("");
  documento.setVersionDescription("");
  documento.setKeyWord("");
  documento.setVersion(1000);

  documentoArray.getItem().add(documento);

  var attachmentArray = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.AttachmentArray");
  var attachment = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.Attachment");

  // log.info("## [Dataset: createDocument] - Nome e extensão do arquivo físico a ser publicado: " + fileName);

  attachment.setFileName(fileName);
  attachment.setPrincipal(true);
  attachment.setFilecontent(bytes);

  attachmentArray.getItem().add(attachment);

  var documentSecurityConfigDtoArray = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.DocumentSecurityConfigDtoArray");
  var approverDtoArray = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.ApproverDtoArray");
  var relatedDocumentDtoArray = webServiceProvider.instantiate("com.totvs.technology.ecm.dm.ws.RelatedDocumentDtoArray");

  // log.info("## [Dataset: createDocument] - chamando createDocument");

  var retornoDocumento = webService.createDocument(usuarioFluig, senhaFLuig, '1', documentoArray, attachmentArray, documentSecurityConfigDtoArray, approverDtoArray, relatedDocumentDtoArray);

  var idDocumento = retornoDocumento.getItem().get(0).getDocumentId();

  return idDocumento;

}
