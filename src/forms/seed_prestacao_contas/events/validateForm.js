/*eslint-disable*/
/*jshint -W116 */
function validateForm(form) {
  const Errors = value(form, 'Errors');

  const despesas = getChildren(form, 'despesas', ['despesaRef']);

  if (Errors && Errors.length > 0) {
    throw Errors.join('\n');
  }
}

function value(form, field, def) {
  return isJson(form.getValue(field)) ? JSON.parse(form.getValue(field)) : def || form.getValue(field);
}

function getChildren(form, tablename, inputs) {
  const array = [];
  const indexes = form.getChildrenIndexes(tablename);
  for (let i = 0; i < indexes.length; i++) {
    const obj = {};
    for (let t = 0; t < inputs.length; t++) {
      obj[inputs[t]] = value(form, `${inputs[t]}___${indexes[i]}`);
    }
    array.push(obj);
  }
  return array;
}

const isJson = function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
