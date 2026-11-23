var database = require("../database/config");
// ESTE ARQUIVO SÓ SERÁ USADO PARA BASEAR ESTRUTURA E NÍVEL DE COMPLEXIDADE (QUAIS FUNÇÕES E COMO) SERÃO USADAS NA APLICAÇÃO FICSIETE, ENTIDADES NÃO CONSTANTES NAS TABELAS DE script-ficsiete.sql NÃO DEVEM SER CONSIDERADAS PARA USO EFETIVO NO CÓDIGO!
function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj) VALUES ('${razaoSocial}', '${cnpj}')`;

  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCnpj, buscarPorId, cadastrar, listar };
