var database = require("../database/config");

async function buscarImagemPorId(idParagrafo) {
    var instrucaoSql = `SELECT imgParagrafo as imagem, mimeImg as mime FROM paragrafoPublicacao WHERE id = ${idParagrafo};`;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarImagemPorId
};
