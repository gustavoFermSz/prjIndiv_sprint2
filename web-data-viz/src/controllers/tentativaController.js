var tentativaModel = require("../models/tentativaModel");
var database = require("../database/config");

async function iniciar(req, res) {
    try {
        var quizId = req.params.idQuiz;
        var usuarioId = req.body.usuario_id || req.body.usuarioId || req.body.usuario || req.query.usuarioId || null;
        if (!quizId || !usuarioId) return res.status(400).send('quizId ou usuarioId ausente');

        let resultado = await tentativaModel.criarTentativa(usuarioId, quizId);
        return res.status(201).json({ tentativaId: resultado.insertId });
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function responder(req, res) {
    try {
        var tentativaId = req.params.idTentativa;
        var questaoId = req.body.questao_id;
        var alternativaId = req.body.alternativa_id;
        if (!tentativaId || !questaoId || !alternativaId) return res.status(400).send('dados incompletos');

        await tentativaModel.inserirResposta(tentativaId, questaoId, alternativaId);

        // verificar se alternativa é correta
        let resultado = await database.executar(`SELECT correta FROM alternativa WHERE id = ${alternativaId};`);
        let correta = false;
        if (resultado && resultado.length > 0 && resultado[0].correta == 1) correta = true;

        return res.status(201).json({ correta });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function finalizar(req, res) {
    try {
        var tentativaId = req.params.idTentativa;
        if (!tentativaId) return res.status(400).send('tentativaId ausente');

        let acertos = await tentativaModel.contarAcertos(tentativaId);
        await tentativaModel.finalizarTentativa(tentativaId, acertos);
        return res.status(200).json({ acertos });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports = { iniciar, responder, finalizar };
