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

async function buscarPorId(idPublicacao) {
    var instrucaoSql = `
        SELECT p.id, p.titulo, p.momentoCriacao, p.usuario_id, p.mimeCapa, u.nome, p.tipoMundoFiccional
        FROM publicacao p
            INNER JOIN usuario u ON p.usuario_id = u.id
        WHERE p.id = ${idPublicacao};
    `;
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

async function deletar(idPublicacao) {
    var instrucaoSql = `DELETE FROM publicacao WHERE id = ?;`;
    return database.efetuar(instrucaoSql, [idPublicacao]);
}

module.exports = {
    listar,
    buscarPorId,
    publicar,
    editar,
    deletar
};
