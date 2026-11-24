var cartaModel = require("../models/cartaModel");

async function listar(req, res) {
    try {
        let resultado = await cartaModel.listar();
        if (resultado.length > 0) {
            return res.status(200).json(resultado);
        } else {
            return res.status(204).send("Nenhum resultado encontrado!");
        }
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage);
    }
}

async function publicar(req, res) {
    try {
        var titulo = req.body.titulo;
        var img = req.body.img; // dataURL
        var usuarioId = req.params.idUsuario;
        var tipoMundoFiccional = req.body.tipoMundoFiccional || null;
        var nivelForca = req.body.nivelForca || null;
        var zonaCampo = req.body.zonaCampo || null;
        var especialidade = req.body.especialidade || null;

        if (!titulo || !usuarioId) {
            return res.status(400).send('Título ou usuário indefinido');
        }

        let tiposPermitidosMundo = ['Ficção especulativa', 'Fantasia Sobrenatural', 'Ficção científica', 'Terror', 'Suspense', 'Ficção histórica', 'Outro'];
        if (!tipoMundoFiccional || tiposPermitidosMundo.indexOf(tipoMundoFiccional) === -1) {
            tipoMundoFiccional = 'Outro';
        }

        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        const limite = 4 * 1024 * 1024;
        let imgBuffer = null;
        let mimeImagem = null;

        if (img && img.startsWith('data:')) {
            let matches = img.match(/^data:(.+);base64,(.+)$/);
            if (!matches) return res.status(400).send('Formato de imagem inválido.');
            mimeImagem = matches[1];
            let dadosBase64 = matches[2];
            let buffer = Buffer.from(dadosBase64, 'base64');
            if (!mimeImagem.startsWith('image/') || !tiposPermitidos.includes(mimeImagem)) return res.status(400).send('Tipo de imagem inválido');
            if (buffer.length > limite) return res.status(400).send('Arquivo muito grande. Máx 4 MB.');
            imgBuffer = buffer;
        }

        let resultado = await cartaModel.publicar(titulo, imgBuffer, mimeImagem, usuarioId, tipoMundoFiccional, nivelForca, zonaCampo, especialidade);
        return res.status(201).json({ insertId: resultado.insertId });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports = { listar, publicar };

async function imagem(req, res) {
    try {
        var idCarta = req.params.idCarta;
        let resultado = await cartaModel.buscarImagem(idCarta);
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
