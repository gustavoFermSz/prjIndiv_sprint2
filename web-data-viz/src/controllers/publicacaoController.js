var publicacaoModel = require("../../src/models/publicacaoModel");
let fs = require('fs').promises;

async function listar(req, res) {
    try {
        let resultado = await publicacaoModel.listarComContagem();
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
        if (resultado.length === 0) return res.status(404).send("Publicação não encontrada");

        let pub = resultado[0];
        // buscar parágrafos
        let paragrafos = await publicacaoModel.buscarParagrafos(idPublicacao);
        pub.paragrafos = paragrafos || [];
        return res.status(200).json(pub);
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

        // validar tipoMundoFiccional contra os valores permitidos no script-ficsiete.sql
        const tiposPermitidosMundo = ['Ficção especulativa', 'Fantasia Sobrenatural', 'Ficção científica', 'Terror', 'Suspense', 'Ficção histórica', 'Outro'];
        if (!tipoMundoFiccional || tiposPermitidosMundo.indexOf(tipoMundoFiccional) === -1) {
            // garantir valor válido - por segurança, definir como 'Outro'
            tipoMundoFiccional = 'Outro';
        }

        if (titulo === undefined || usuarioId === undefined) {
            return res.status(400).send("Título ou usuário indefinido");
        }

        // tratar imagem da capa (obrigatória)
        if (!imgCapa) {
            return res.status(400).send('Capa obrigatória');
        }

        let imgBuffer = null;
        let mimeCapa = null;
        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        const limite = 4 * 1024 * 1024;

        if (imgCapa && imgCapa.startsWith('data:')) {
            let matches = imgCapa.match(/^data:(.+);base64,(.+)$/);
            if (!matches) {
                return res.status(400).send('Formato de imagem inválido.');
            }
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

        // inserir publicação primeiro
        let resultado = await publicacaoModel.publicar(titulo, imgBuffer, mimeCapa, usuarioId, tipoMundoFiccional);
        let idPublicacao = resultado.insertId;

        // tratar parágrafos enviados no body
        let paragrafos = req.body.paragrafos || [];
        if (paragrafos.length === 0) {
            await publicacaoModel.deletar(idPublicacao);
            return res.status(400).send('Deve haver ao menos 1 parágrafo');
        }
        if (paragrafos.length > 6) {
            await publicacaoModel.deletar(idPublicacao);
            return res.status(400).send('Máximo 6 parágrafos permitidos');
        }

        // garantir números de ordem únicos
        let ordens = [];
        for (let i = 0; i < paragrafos.length; i++) {
            let p = paragrafos[i];
            if (p.numeroNaOrdem === undefined || p.conteudo === undefined) {
                await publicacaoModel.deletar(idPublicacao);
                return res.status(400).send('Cada parágrafo precisa de numeroNaOrdem e conteúdo');
            }
            if (ordens.indexOf(p.numeroNaOrdem) !== -1) {
                await publicacaoModel.deletar(idPublicacao);
                return res.status(400).send('Números de ordem duplicados em parágrafos');
            }
            ordens.push(p.numeroNaOrdem);
        }

        // inserir parágrafos um-a-um; em caso de erro, apagar publicação e abortar
        try {
            for (let i = 0; i < paragrafos.length; i++) {
                let p = paragrafos[i];
                let imgBufferPar = null;
                let mimePar = null;
                if (p.imgParagrafo && p.imgParagrafo.startsWith('data:')) {
                    let matchesP = p.imgParagrafo.match(/^data:(.+);base64,(.+)$/);
                    if (!matchesP) {
                        throw new Error('Formato de imagem inválido em parágrafo');
                    }
                    mimePar = matchesP[1];
                    let dadosBase64Par = matchesP[2];
                    let bufPar = Buffer.from(dadosBase64Par, 'base64');
                    if (!tiposPermitidos.includes(mimePar)) {
                        throw new Error('Tipo de imagem inválido em parágrafo');
                    }
                    if (bufPar.length > limite) {
                        throw new Error('Imagem de parágrafo muito grande. Máx 4MB');
                    }
                    imgBufferPar = bufPar;
                }

                await publicacaoModel.inserirParagrafo(idPublicacao, p.numeroNaOrdem, p.subtitulo || null, p.conteudo, imgBufferPar, mimePar);
            }
        } catch (err) {
            console.log(err);
            await publicacaoModel.deletar(idPublicacao);
            return res.status(500).send('Erro ao inserir parágrafos: ' + err.message);
        }

        return res.status(201).json({ insertId: idPublicacao });

    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function editar(req, res) {
    try {
        var idPublicacao = req.params.idPublicacao;
        var novoTitulo = req.body.titulo;
        var imgCapa = req.body.imgCapa; // optional dataURL; if not provided, keep existing
        var tipoMundoFiccional = req.body.tipoMundoFiccional;

        const tiposPermitidosMundo = ['Ficção especulativa', 'Fantasia Sobrenatural', 'Ficção científica', 'Terror', 'Suspense', 'Ficção histórica', 'Outro'];
        if (tipoMundoFiccional && tiposPermitidosMundo.indexOf(tipoMundoFiccional) === -1) {
            tipoMundoFiccional = 'Outro';
        }

        if (!idPublicacao || !novoTitulo) return res.status(400).send('Dados incompletos');

        let imgBuffer = undefined; // undefined => don't touch, null => explicitly clear
        let mimeCapa = null;
        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        const limite = 4 * 1024 * 1024;

        if (imgCapa !== undefined) {
            if (imgCapa === null || imgCapa === '') {
                // explicit removal
                imgBuffer = null;
                mimeCapa = null;
            } else if (typeof imgCapa === 'string' && imgCapa.startsWith('data:')) {
                let matches = imgCapa.match(/^data:(.+);base64,(.+)$/);
                if (!matches) return res.status(400).send('Formato de imagem inválido.');
                mimeCapa = matches[1];
                let dadosBase64 = matches[2];
                let buffer = Buffer.from(dadosBase64, 'base64');
                if (!mimeCapa.startsWith('image/') || !tiposPermitidos.includes(mimeCapa)) {
                    return res.status(400).send('Arquivo não é uma imagem ou não é de tipo permitido.');
                }
                if (buffer.length > limite) return res.status(400).send('Arquivo muito grande. Máx 4 MB.');
                imgBuffer = buffer;
            } else {
                return res.status(400).send('imgCapa deve ser dataURL ou null');
            }
        }

        // aplicar edição na publicação
        let resultado = await publicacaoModel.editarCompleto(idPublicacao, novoTitulo, imgBuffer, mimeCapa, tipoMundoFiccional);

        // tratar parágrafos se enviados: substituir todos
        let paragrafos = req.body.paragrafos;
        if (paragrafos !== undefined) {
            if (!Array.isArray(paragrafos) || paragrafos.length === 0) {
                return res.status(400).send('Deve haver ao menos 1 parágrafo');
            }
            if (paragrafos.length > 6) return res.status(400).send('Máximo 6 parágrafos permitidos');

            // validar ordens
            let ordens = [];
            for (let i = 0; i < paragrafos.length; i++) {
                let p = paragrafos[i];
                if (p.numeroNaOrdem === undefined || p.conteudo === undefined) {
                    return res.status(400).send('Cada parágrafo precisa de numeroNaOrdem e conteúdo');
                }
                if (ordens.indexOf(p.numeroNaOrdem) !== -1) return res.status(400).send('Números de ordem duplicados em parágrafos');
                ordens.push(p.numeroNaOrdem);
            }

            // apagar e inserir novos
            await publicacaoModel.deletarParagrafosPorPublicacao(idPublicacao);
            try {
                for (let i = 0; i < paragrafos.length; i++) {
                    let p = paragrafos[i];
                    let imgBufferPar = null;
                    let mimePar = null;
                    if (p.imgParagrafo && p.imgParagrafo.startsWith('data:')) {
                        let matchesP = p.imgParagrafo.match(/^data:(.+);base64,(.+)$/);
                        if (!matchesP) throw new Error('Formato de imagem inválido em parágrafo');
                        mimePar = matchesP[1];
                        let dadosBase64Par = matchesP[2];
                        let bufPar = Buffer.from(dadosBase64Par, 'base64');
                        if (!tiposPermitidos.includes(mimePar)) throw new Error('Tipo de imagem inválido em parágrafo');
                        if (bufPar.length > limite) throw new Error('Imagem de parágrafo muito grande. Máx 4MB');
                        imgBufferPar = bufPar;
                    }
                    await publicacaoModel.inserirParagrafo(idPublicacao, p.numeroNaOrdem, p.subtitulo || null, p.conteudo, imgBufferPar, mimePar);
                }
            } catch (err) {
                console.log(err);
                return res.status(500).send('Erro ao inserir parágrafos: ' + err.message);
            }
        }

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

async function capa(req, res) {
    try {
        var idPublicacao = req.params.idPublicacao;
        let resultado = await publicacaoModel.buscarCapa(idPublicacao);
        if (!resultado || resultado.length === 0) return res.status(404).send('Capa não encontrada');
        const registro = resultado[0];
        if (!registro.imagem) return res.status(404).send('Capa vazia');
        res.setHeader('Content-Type', registro.mime || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.send(registro.imagem);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

module.exports.capa = capa;

async function paragrafoImagem(req, res) {
    try {
        const idParagrafo = req.params.idParagrafo;
        let resultado = await publicacaoModel.buscarImagemParagrafo(idParagrafo);
        if (!resultado || resultado.length === 0) return res.status(404).send('Imagem não encontrada');
        const registro = resultado[0];
        if (!registro.imagem) return res.status(404).send('Imagem vazia');
        res.setHeader('Content-Type', registro.mime || 'application/octet-stream');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.send(registro.imagem);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err.sqlMessage || err);
    }
}

module.exports.paragrafoImagem = paragrafoImagem;
