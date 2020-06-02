function calculaTotalDias(inicio, termino) {

  const dia = 1000 * 60 * 60 * 24;
  const diferenca = Math.abs(termino - inicio);
  const total = diferenca / dia;

  return total;
}
