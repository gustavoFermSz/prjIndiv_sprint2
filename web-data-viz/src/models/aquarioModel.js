var database = require("../database/config");

function buscarAquariosPorEmpresa() {

  var instrucaoSql = `SELECT * FROM aquario a`;     //WHERE fk_empresa = ${empresaId}

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrar(descricao) {
  
  var instrucaoSql = `INSERT INTO (descricao) aquario VALUES (${descricao})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  buscarAquariosPorEmpresa,
  cadastrar
}
