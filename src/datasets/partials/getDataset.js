function getDataset(name, campos, filtros) {

  const constraints = new Array(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));

  if (filtros) {
    filtros.forEach(filtro => {
      constraints.push(DatasetFactory.createConstraint(filtro.field, filtro.value, filtro.value, ConstraintType.MUST));
    })
  }

  const dataset = DatasetFactory.getDataset(name, null, constraints, null);
  const result = [];

  if (dataset.rowsCount > 0) {
    for (var i = 0; i < dataset.rowsCount; i++) {
      const o = {};
      campos.forEach(campo => {
        o[campo] = dataset.getValue(i, campo);
      });
      result.push(o);
    }
  }

  return result;
}
