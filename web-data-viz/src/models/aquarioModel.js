var database = require("../database/config");
// ESTE ARQUIVO SÓ SERÁ USADO PARA BASEAR ESTRUTURA E NÍVEL DE COMPLEXIDADE (QUAIS FUNÇÕES E COMO) SERÃO USADAS NA APLICAÇÃO FICSIETE, ENTIDADES NÃO CONSTANTES NAS TABELAS DE script-ficsiete.sql NÃO DEVEM SER CONSIDERADAS PARA USO EFETIVO NO CÓDIGO!
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
