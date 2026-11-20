var database = require("../database/config");

async function criarTentativa(usuarioId, quizId) {
    var instrucaoSql = `INSERT INTO tentativaQuiz (usuario_id, quiz_id, inicio) VALUES (?, ?, NOW());`;
    var resultado = await database.efetuar(instrucaoSql, [usuarioId, quizId]);
    return resultado; // contém insertId
}

async function inserirResposta(tentativaId, questaoId, alternativaId) {
    var instrucaoSql = `INSERT INTO registro_assinalacoes (tentativa_id, questao_id, alternativa_id) VALUES (?, ?, ?);`;
    return database.efetuar(instrucaoSql, [tentativaId, questaoId, alternativaId]);
}

async function contarAcertos(tentativaId) {
    var instrucaoSql = `
        SELECT COUNT(*) AS acertos
        FROM registro_assinalacoes r
            INNER JOIN alternativa a ON r.alternativa_id = a.id
        WHERE r.tentativa_id = ${tentativaId} AND a.correta = 1;
    `;
    var res = await database.executar(instrucaoSql);
    return res[0].acertos;
}

async function finalizarTentativa(tentativaId, pontuacao) {
    var instrucaoSql = `UPDATE tentativaQuiz SET fimTentativa = NOW(), pontuacao = ? WHERE id = ?;`;
    return database.efetuar(instrucaoSql, [pontuacao, tentativaId]);
}

module.exports = {
    criarTentativa,
    inserirResposta,
    contarAcertos,
    finalizarTentativa
};
