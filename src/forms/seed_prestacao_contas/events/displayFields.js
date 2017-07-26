/*eslint-disable*/
/*jshint -W116 */
function displayFields(form, customHTML) {
  const Params = {};
  Params.formMode = String(form.getFormMode());
  Params.edit = Params.formMode == 'ADD' || Params.formMode == 'MOD';

  form.setValue('Params', JSON.stringify(Params));

  form.setShowDisabledFields(true);
}
