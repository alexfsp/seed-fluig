function startProcess(user, password, processCode, campos, values, atividadeDestino, obs, colleagueId) {
    const company = 1,
        workServiceProvider = ServiceManager.getServiceInstance("ECMWorkflowEngineService"),
        workServiceLocator = workServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService"),
        workService = workServiceLocator.getWorkflowEngineServicePort(),
        processAttachmentDtoArray = workServiceProvider.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray'),
        processTaskAppointmentDtoArray = workServiceProvider.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray'),
        cardData = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArrayArray');

    campos.forEach(campo => {
        var field = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArray');

        field.getItem().add(campo.toString());
        field.getItem().add(values[campo].toString());

        cardData.getItem().add(field);
    })

    var colleagueIds = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArray');
    var retorno = workService.startProcess(user, password, parseInt(company), processCode, atividadeDestino,
        colleagueIds, obs, user, true, processAttachmentDtoArray, cardData, processTaskAppointmentDtoArray, false);

    let solicitacao;

    for (var r = 0; r < retorno.getItem().size(); r++) {
        if (retorno.getItem().get(r).getItem().get(0) == "iProcess") {
            solicitacao = retorno.getItem().get(r).getItem().get(1);
        }
    }

    return solicitacao;
}