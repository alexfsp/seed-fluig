function getAndCreateAttachments(usuarioFluig, senhaFLuig, message, pastaAnexos) {

  const multiPart = message.getContent();

  const attachments = [];

  try {

    for (let i = 0; i < multiPart.getCount(); i++) {
      let part = multiPart.getBodyPart(i);
      if (javax.mail.Part.ATTACHMENT.equalsIgnoreCase(part.getDisposition())) {
        let description = part.getFileName();

        description = javax.mail.internet.MimeUtility.decodeText(description);
        
        let filename = makeid(5) + '.' + org.apache.commons.io.FilenameUtils.getExtension(description);

        let bytes = getContent(part.getInputStream());

        let documentId = createDocument(usuarioFluig, senhaFLuig, Number(pastaAnexos), filename, description, bytes);

        let url = getDownloadURL(documentId);

        attachments.push({
          id: String(documentId),
          description: String(description),
          url: String(url)
        })
      }
    }
  } catch (error) {
    log.info(error);
  }

  return JSON.stringify(attachments);
}

function getContent(stream) {
  var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8192);
  let baos = new java.io.ByteArrayOutputStream();

  var len = 0;

  while ((len = stream.read(buffer, 0, buffer.length)) != -1) {
    baos.write(buffer, 0, len);
  }

  return baos.toByteArray();

}