var quizModel = require("../models/quizModel");

async function listar(req, res) {
    try {
        let resultado = await quizModel.listar();
        if (resultado.length > 0) return res.status(200).json(resultado);
        else return res.status(204).send('Nenhum resultado encontrado!');
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function buscarCompleto(req, res) {
    try {
        let id = req.params.idQuiz;
        let resultado = await quizModel.buscarCompleto(id);
        if (!resultado || Object.keys(resultado).length === 0) return res.status(404).send('Quiz não encontrado');
        return res.status(200).json(resultado);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

// Criar quiz com questões/alternativas em um único POST
async function criar(req, res) {
    try {
        let body = req.body;
        // Validação mínima: título, usuario_id, questoes array
        if (!body.titulo || !body.usuario_id || !Array.isArray(body.questoes) || body.questoes.length === 0) {
            return res.status(400).send('Dados de quiz incompletos');
        }

        // validações de cada questão
        for (let q of body.questoes) {
            if (!q.pergunta) return res.status(400).send('Cada questão precisa ter uma pergunta');
            if (!Array.isArray(q.alternativas) || q.alternativas.length < 2 || q.alternativas.length > 5) return res.status(400).send('Cada questão deve ter entre 2 e 5 alternativas');
            let corretas = q.alternativas.filter(a => a.correta);
            if (corretas.length !== 1) return res.status(400).send('Cada questão deve ter exatamente 1 alternativa correta');
        }

        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        const limite = 4 * 1024 * 1024;

        if (body.imagemTema && body.imagemTema.startsWith('data:')) {
            let matches = body.imagemTema.match(/^data:(.+);base64,(.+)$/);
            if (!matches) return res.status(400).send('Formato de imagem inválido para capa do quiz');
            body.mimeImagem = matches[1];
            let dados = matches[2];
            let buffer = Buffer.from(dados, 'base64');
            if (!tiposPermitidos.includes(body.mimeImagem)) return res.status(400).send('Tipo de imagem inválido');
            if (buffer.length > limite) return res.status(400).send('Imagem muito grande. Máx 4MB');
            body.imagemTemaBuffer = buffer;
        }

        for (let q of body.questoes) {
            if (q.imagemFundo && q.imagemFundo.startsWith('data:')) {
                let m = q.imagemFundo.match(/^data:(.+);base64,(.+)$/);
                if (!m) return res.status(400).send('Formato de imagem inválido em questão');
                q.mimeImagem = m[1];
                let buf = Buffer.from(m[2], 'base64');
                if (!tiposPermitidos.includes(q.mimeImagem)) return res.status(400).send('Tipo de imagem inválido em questão');
                if (buf.length > limite) return res.status(400).send('Imagem de questão muito grande. Máx 4MB');
                q.imagemFundoBuffer = buf;
            }
        }

        let resultado = await quizModel.criar(body);
        return res.status(201).json(resultado);

    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports = { listar, buscarCompleto, criar };

async function imagem(req, res) {
    try {
        var idQuiz = req.params.idQuiz;
        let resultado = await quizModel.buscarImagem(idQuiz);
        if (!resultado || resultado.length === 0) return res.status(404).send('Imagem não encontrada');
        const registro = resultado[0];
        if (!registro.imagem) return res.status(404).send('Imagem vazia');
        res.setHeader('Content-Type', registro.mime || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.send(registro.imagem);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports.imagem = imagem;
