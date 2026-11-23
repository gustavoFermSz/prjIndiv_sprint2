var paragrafoModel = require("../models/paragrafoModel");

async function imagem(req, res) {
    try {
        var idParagrafo = req.params.idParagrafo;
        let resultado = await paragrafoModel.buscarImagemPorId(idParagrafo);
        if (!resultado || resultado.length === 0) return res.status(404).send('Imagem de parágrafo não encontrada');
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

module.exports = { imagem };
