var database = require("../database/config");
// ESTE ARQUIVO SÓ SERÁ USADO PARA BASEAR ESTRUTURA E NÍVEL DE COMPLEXIDADE (QUAIS FUNÇÕES E COMO) SERÃO USADAS NA APLICAÇÃO FICSIETE, ENTIDADES NÃO CONSTANTES NAS TABELAS DE script-ficsiete.sql NÃO DEVEM SER CONSIDERADAS PARA USO EFETIVO NO CÓDIGO!
function buscarUltimasMedidas(idAquario, limite_linhas) {

    var instrucaoSql = `SELECT 
                        temperatura,
                        momento,
                        DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico
                    FROM medida
                    WHERE fk_aquario = ${idAquario}
                    ORDER BY id DESC LIMIT ${limite_linhas}`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idAquario) {

    var instrucaoSql = `SELECT 
                        temperatura,
                        DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico, 
                        fk_aquario 
                        FROM medida WHERE fk_aquario = ${idAquario} 
                    ORDER BY id DESC LIMIT 1`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}
