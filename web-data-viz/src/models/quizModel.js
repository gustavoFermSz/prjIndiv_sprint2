var database = require("../database/config");

async function listar() {
    var instrucaoSql = `SELECT id, titulo, dtCriacao, usuario_id, tipoMundoFiccional FROM quiz ORDER BY dtCriacao DESC;`;
    return database.executar(instrucaoSql);
}

async function buscarCompleto(quizId) {
    // traz quiz com suas questoes e alternativas
    var instrucaoQuiz = `SELECT * FROM quiz WHERE id = ${quizId};`;
    var quiz = await database.executar(instrucaoQuiz);
    if (!quiz || quiz.length === 0) return [];

    var instrucaoQuestoes = `SELECT * FROM questaoQuiz WHERE quiz_id = ${quizId} ORDER BY id;`;
    var questoes = await database.executar(instrucaoQuestoes);

    for (let i = 0; i < questoes.length; i++) {
        let q = questoes[i];
        let instrucaoAlts = `SELECT id, texto, correta, questaoQuiz_id FROM alternativa WHERE questaoQuiz_id = ${q.id};`;
        let alts = await database.executar(instrucaoAlts);
        q.alternativas = alts;
    }

    return { quiz: quiz[0], questoes };
}

async function criar(quizObj) {
    // quizObj: { titulo, imagemTemaBuffer, mimeImagem, nivelDificuldade, tipoMundoFiccional, sinopse, usuario_id, questoes: [{ pergunta, imagemFundo (base64 handled earlier), alternativas: [{ texto, correta }] }] }
    // inserir quiz
    var instrucaoSql = `INSERT INTO quiz (titulo, dtCriacao, imagemTema, nivelDificuldade, tipoMundoFiccional, sinopse, usuario_id, mimeImagem) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?);`;
    var parametrosQuiz = [quizObj.titulo, quizObj.imagemTemaBuffer, quizObj.nivelDificuldade, quizObj.tipoMundoFiccional, quizObj.sinopse, quizObj.usuario_id, quizObj.mimeImagem];
    var resultadoQuiz = await database.efetuar(instrucaoSql, parametrosQuiz);
    var quizId = resultadoQuiz.insertId;

    // inserir questões e alternativas
    for (let i = 0; i < quizObj.questoes.length; i++) {
        let quest = quizObj.questoes[i];
        let instrQuest = `INSERT INTO questaoQuiz (pergunta, imagemFundo, quiz_id, mimeImagem) VALUES (?, ?, ?, ?);`;
        let resQuest = await database.efetuar(instrQuest, [quest.pergunta, quest.imagemFundoBuffer || null, quizId, quest.mimeImagem || null]);
        let questId = resQuest.insertId;

        for (let j = 0; j < quest.alternativas.length; j++) {
            let alt = quest.alternativas[j];
            let instrAlt = `INSERT INTO alternativa (texto, correta, questaoQuiz_id) VALUES (?, ?, ?);`;
            await database.efetuar(instrAlt, [alt.texto, alt.correta ? 1 : 0, questId]);
        }
    }

    return { quizId };
}

module.exports = {
    listar,
    buscarCompleto,
    criar
};

async function buscarImagem(quizId) {
    var instrucaoSql = `SELECT imagemTema AS imagem, mimeImagem AS mime FROM quiz WHERE id = ${quizId};`;
    return database.executar(instrucaoSql);
}

module.exports.buscarImagem = buscarImagem;
