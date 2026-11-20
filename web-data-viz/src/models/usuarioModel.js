var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    let instrucaoSql = `
        SELECT id, imgAvatar, mimeAvatar, nome, email, arroba, tipoConta FROM usuario WHERE email = (?) AND senha = (?);
    `;

    let parametrosSql = [email, senha];
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.efetuar(instrucaoSql, parametrosSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(avatarBuffer, avatarMime, nome, email, arroba, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", avatarBuffer, avatarMime, nome, email, arroba, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    let instrucaoSql = `
        INSERT INTO usuario (imgAvatar, mimeAvatar, nome, email, arroba, senha, tipoConta) VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        
    let parametrosSql = [avatarBuffer, avatarMime, nome, email, arroba,  senha, 2];

    // connection.query(instrucaoSql, parametrosSql, (err, result) => {
    // não sei o que deve ser colocado
    // });      Redundante com database.executar

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.efetuar(instrucaoSql, parametrosSql);      
}




function verificarEmail(email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verEmail(): ", email)
    let instrucaoSql = `
        SELECT email FROM usuario WHERE email = (?);
    `;

    let parametrosSql = [email];

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.efetuar(instrucaoSql, parametrosSql);
}

function verificarArroba(arroba) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verarroba(): ", arroba)
    let instrucaoSql = `
        SELECT arroba FROM usuario WHERE arroba = (?);
    `;

    let parametrosSql = [arroba];

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.efetuar(instrucaoSql, parametrosSql);
}










module.exports = {
    autenticar,
    cadastrar,
    verificarArroba,
    verificarEmail
    // , dadosUsuario
};