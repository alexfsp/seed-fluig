function getParams(constraints) {
  const params = {};
  if (constraints) {
    for (let i = 0; i < constraints.length; i++) {
      params[constraints[i].fieldName] = String(constraints[i].initialValue);
    }
  } else {
    params.DISPLAYKEY = '';
  }

  return params;
}
