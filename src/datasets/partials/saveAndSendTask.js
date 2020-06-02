function saveAndSendTask(user, password, solicitacao, campos, values, atividadeDestino, completeTask, managerMode, obs) {
    const company = 1,
        workServiceProvider = ServiceManager.getServiceInstance("ECMWorkflowEngineService"),
        workServiceLocator = workServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService"),
        workService = workServiceLocator.getWorkflowEngineServicePort(),
        processAttachmentDtoArray = workServiceProvider.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray'),
        processTaskAppointmentDtoArray = workServiceProvider.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray'),
        cardData = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArrayArray');

    user = user || 'adm';
    password = password || 'M&str@N@d@';

    campos.forEach(campo => {
        var field = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArray');

        field.getItem().add(campo);
        field.getItem().add(values[campo]);

        cardData.getItem().add(field);
    })

    var colleagueId = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArray');

    // var retorno = workServiceProvider.instantiate('net.java.dev.jaxb.array.StringArrayArray');
    var retorno = workService.saveAndSendTask(
        user,
        password,
        parseInt(company),
        solicitacao,
        atividadeDestino,
        colleagueId,
        obs,
        user,
        completeTask,
        processAttachmentDtoArray,
        cardData,
        processTaskAppointmentDtoArray,
        managerMode,
        0
    );

    return;
}