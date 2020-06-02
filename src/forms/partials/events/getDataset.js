function getDataset(name, campos, filtros, internal) {

  const constraints = new Array();

  if (!internal) {
    constraints.push(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));
  }

  if (filtros) {
    filtros.forEach(filtro => {
      constraints.push(DatasetFactory.createConstraint(filtro.field, filtro.value, filtro.value, filtro.type || ConstraintType.MUST));
    })
  }

  const dataset = DatasetFactory.getDataset(name, null, constraints, null);
  const result = [];

  if (dataset.rowsCount > 0) {
    for (var i = 0; i < dataset.rowsCount; i++) {
      const o = {};

      if (!campos) {
        campos = dataset.getColumnsName();
      }

      campos.forEach(campo => {
        o[campo] = dataset.getValue(i, campo);
      });

      result.push(o);
    }
  }

  return result;
}
