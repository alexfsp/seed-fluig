function getTextFromMimeMultipart(mimeMultipart) {
    try {
        let html = '',
            text = '',
            result = '';

        let count = mimeMultipart.getCount();
        for (let i = 0; i < count; i++) {
            var bodyPart = mimeMultipart.getBodyPart(i);
            if (bodyPart.isMimeType("text/plain")) {
                text = bodyPart.getContent();
            } else if (bodyPart.isMimeType("text/html")) {
                html = bodyPart.getContent();
            } else if (bodyPart.getContent() instanceof javax.mail.internet.MimeMultipart) {
                result = result + getTextFromMimeMultipart(bodyPart.getContent());
            }
        }
        result = html || text || result;
        return result;
    } catch (error) {
        return mimeMultipart;
    }

}

