function executaSql(query, type, campos, _dataSource) {
  log.info(`executaSql: ${query}`);

  const dataSource = _dataSource || '/jdbc/FluigDS';
  const ic = new javax.naming.InitialContext();
  const ds = ic.lookup(dataSource);
  const created = false;
  var result = '';

  if (!query) {
    log.error('*** executaSql ERRO: query vazia!');
    return;
  }

  try {
    var conn = ds.getConnection();
    var stmt = conn.createStatement();
    let rs;
    if (type === 'update') {
      rs = stmt.executeUpdate(query);
    } else {
      rs = stmt.executeQuery(query);
      var result = [];
      while (rs.next()) {
        var documento = {};
        campos.forEach((campo) => {
          documento[campo] = String(rs.getString(campo));
        });

        result.push(documento);
      }
    }
  } catch (e) {
    log.error(`*** executaSql ERRO ${e.message}`);
    throw e.message;
  } finally {
    if (stmt != null) {
      stmt.close();
    }
    if (conn != null) {
      conn.close();
    }
  }

  log.info('*** executaSql fim ***');

  return result;
}
