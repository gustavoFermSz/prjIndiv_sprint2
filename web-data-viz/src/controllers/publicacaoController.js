var publicacaoModel = require("../../src/models/publicacaoModel");
let fs = require('fs').promises;

async function listar(req, res) {
    try {
        let resultado = await publicacaoModel.listar();
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

async function buscarPorId(req, res) {
    var idPublicacao = req.params.idPublicacao;
    try {
        let resultado = await publicacaoModel.buscarPorId(idPublicacao);
        if (resultado.length > 0) {
            return res.status(200).json(resultado[0]);
        } else {
            return res.status(404).send("Publicação não encontrada");
        }
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage);
    }
}

// Publicar com imagem em base64 ou sem imagem
async function publicar(req, res) {
    try {
        var titulo = req.body.titulo;
        var imgCapa = req.body.imgCapa; // dataURL ou null
        var usuarioId = req.params.idUsuario;
        var tipoMundoFiccional = req.body.tipoMundoFiccional || null;

        if (titulo == undefined || usuarioId == undefined) {
            return res.status(400).send("Título ou usuário indefinido");
        }

        // tratar imagem
        let imgBuffer = null;
        let mimeCapa = null;
        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        const limite = 4 * 1024 * 1024;

        if (imgCapa && imgCapa.startsWith('data:')) {
            let matches = imgCapa.match(/^data:(.+);base64,(.+)$/);
            if (!matches) return res.status(400).send('Formato de imagem inválido.');
            mimeCapa = matches[1];
            let dadosBase64 = matches[2];
            let buffer = Buffer.from(dadosBase64, 'base64');
            if (!mimeCapa.startsWith('image/') || !tiposPermitidos.includes(mimeCapa)) {
                return res.status(400).send('Arquivo não é uma imagem ou não é de tipo permitido.');
            }
            if (buffer.length > limite) {
                return res.status(400).send('Arquivo muito grande. Máx 4 MB.');
            }
            imgBuffer = buffer;
        }

        let resultado = await publicacaoModel.publicar(titulo, imgBuffer, mimeCapa, usuarioId, tipoMundoFiccional);
        return res.status(201).json({ insertId: resultado.insertId });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function editar(req, res) {
    try {
        var idPublicacao = req.params.idPublicacao;
        var novoTitulo = req.body.titulo;
        if (!idPublicacao || !novoTitulo) return res.status(400).send('Dados incompletos');
        let resultado = await publicacaoModel.editar(novoTitulo, idPublicacao);
        return res.status(200).json(resultado);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function deletar(req, res) {
    try {
        var idPublicacao = req.params.idPublicacao;
        if (!idPublicacao) return res.status(400).send('idPublicacao ausente');
        let resultado = await publicacaoModel.deletar(idPublicacao);
        return res.status(200).json(resultado);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports = {
    listar,
    publicar,
    buscarPorId,
    editar,
    deletar
};
