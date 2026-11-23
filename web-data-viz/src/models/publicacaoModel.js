var database = require("../../src/database/config");

async function listar() {
    var instrucaoSql = `
        SELECT p.id, p.titulo, p.momentoCriacao, p.usuario_id, p.mimeCapa, u.nome
        FROM publicacao p
            INNER JOIN usuario u ON p.usuario_id = u.id
        ORDER BY p.momentoCriacao DESC;
    `;
    return database.executar(instrucaoSql);
}

async function listarComContagem() {
    var instrucaoSql = `
        SELECT p.id, p.titulo, p.momentoCriacao, p.usuario_id, p.mimeCapa, u.nome,
            (SELECT COUNT(*) FROM paragrafoPublicacao pp WHERE pp.publicacao_id = p.id) AS qtdParagrafos
        FROM publicacao p
            INNER JOIN usuario u ON p.usuario_id = u.id
        ORDER BY p.momentoCriacao DESC;
    `;
    return database.executar(instrucaoSql);
}

async function buscarPorId(idPublicacao) {
    var instrucaoSql = `
        SELECT p.id, p.titulo, p.momentoCriacao, p.usuario_id, p.mimeCapa, u.nome, p.tipoMundoFiccional
        FROM publicacao p
            INNER JOIN usuario u ON p.usuario_id = u.id
        WHERE p.id = ${idPublicacao};
    `;
    return database.executar(instrucaoSql);
}

async function buscarParagrafos(publicacaoId) {
    var instrucaoSql = `
        SELECT id, numeroNaOrdem, subtitulo, conteudo, mimeImg, imgParagrafo IS NOT NULL AS temImagem
        FROM paragrafoPublicacao
        WHERE publicacao_id = ${publicacaoId}
        ORDER BY numeroNaOrdem ASC;
    `;
    return database.executar(instrucaoSql);
}

async function buscarImagemParagrafo(paragrafoId) {
    var instrucaoSql = `SELECT imgParagrafo AS imagem, mimeImg AS mime FROM paragrafoPublicacao WHERE id = ${paragrafoId};`;
    return database.executar(instrucaoSql);
}

async function publicar(titulo, imgBuffer, mimeCapa, usuarioId, tipoMundoFiccional) {
    var instrucaoSql = `
        INSERT INTO publicacao (titulo, momentoCriacao, imgCapa, usuario_id, mimeCapa, tipoMundoFiccional)
        VALUES (?, NOW(), ?, ?, ?, ?);
    `;

    var parametros = [titulo, imgBuffer, usuarioId, mimeCapa, tipoMundoFiccional];
    return database.efetuar(instrucaoSql, parametros);
}

async function editar(novoTitulo, idPublicacao) {
    var instrucaoSql = `UPDATE publicacao SET titulo = ? WHERE id = ?;`;
    return database.efetuar(instrucaoSql, [novoTitulo, idPublicacao]);
}

// edição mais completa: título, capa opcional, mime e tipo
async function editarCompleto(idPublicacao, titulo, imgBuffer, mimeCapa, tipoMundoFiccional) {
    // montar SQL condicional para não sobrescrever capa quando imgBuffer === undefined
    let instrucaoSql = `UPDATE publicacao SET titulo = ?`;
    const parametros = [titulo];

    if (imgBuffer !== undefined) {
        instrucaoSql += `, imgCapa = ?, mimeCapa = ?`;
        parametros.push(imgBuffer, mimeCapa);
    }

    if (tipoMundoFiccional !== undefined) {
        instrucaoSql += `, tipoMundoFiccional = ?`;
        parametros.push(tipoMundoFiccional);
    }

    instrucaoSql += ` WHERE id = ?;`;
    parametros.push(idPublicacao);

    return database.efetuar(instrucaoSql, parametros);
}

async function deletar(idPublicacao) {
    var instrucaoSql = `DELETE FROM publicacao WHERE id = ?;`;
    return database.efetuar(instrucaoSql, [idPublicacao]);
}

async function deletarParagrafosPorPublicacao(publicacaoId) {
    var instrucaoSql = `DELETE FROM paragrafoPublicacao WHERE publicacao_id = ?;`;
    return database.efetuar(instrucaoSql, [publicacaoId]);
}

async function buscarCapa(idPublicacao) {
    var instrucaoSql = `SELECT imgCapa AS imagem, mimeCapa AS mime FROM publicacao WHERE id = ${idPublicacao};`;
    return database.executar(instrucaoSql);
}

async function inserirParagrafo(publicacaoId, numeroNaOrdem, subtitulo, conteudo, imgBuffer, mimeImg) {
    var instrucaoSql = `INSERT INTO paragrafoPublicacao (publicacao_id, numeroNaOrdem, subtitulo, conteudo, imgParagrafo, mimeImg) VALUES (?, ?, ?, ?, ?, ?);`;
    var parametros = [publicacaoId, numeroNaOrdem, subtitulo, conteudo, imgBuffer, mimeImg];
    return database.efetuar(instrucaoSql, parametros);
}

module.exports = {
    listar,
    listarComContagem,
    buscarPorId,
    buscarParagrafos,
    publicar,
    editar,
    editarCompleto,
    deletar,
    deletarParagrafosPorPublicacao,
    buscarCapa,
    inserirParagrafo
};
