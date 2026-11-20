var database = require("../database/config");

async function listar() {
    var instrucaoSql = `
        SELECT c.id, c.titulo, c.dtConfeccao, c.usuario_id, c.mimeImagem, u.nome
        FROM carta c
            INNER JOIN usuario u ON c.usuario_id = u.id
        ORDER BY c.dtConfeccao DESC;
    `;
    return database.executar(instrucaoSql);
}

async function publicar(titulo, imgBuffer, mimeImagem, usuarioId, tipoMundoFiccional, nivelForca, zonaCampo, especialidade) {
    var instrucaoSql = `
        INSERT INTO carta (titulo, imagem, nivelForca, zonaCampo, especialidade, tipoMundoFiccional, usuario_id, mimeImagem, dtConfeccao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
    `;
    var parametros = [titulo, imgBuffer, nivelForca, zonaCampo, especialidade, tipoMundoFiccional, usuarioId, mimeImagem];
    return database.efetuar(instrucaoSql, parametros);
}

module.exports = {
    listar,
    publicar
};
