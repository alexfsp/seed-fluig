function getConstraints(constraints) {
  const ttParam = {};
  if (constraints) {
    for (let i = 0; i < constraints.length; i++) {
      ttParam[constraints[i].fieldName] = String(constraints[i].initialValue);
    }
  } else {
    ttParam.DISPLAYKEY = '';
  }

  return {
    ttParam: [ttParam]
  };
}
