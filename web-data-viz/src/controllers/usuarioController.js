var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        return res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    return res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    return res.status(204).json({ aquarios: [] });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        return res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        return res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    return res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

async function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var avatar = req.body.avatarServer;
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var arroba = req.body.arrobaServer;
    var senha = req.body.senhaServer;
    var confirmacaoSenha = req.body.confirmacaoSenhaServer;



    // Validações dos valores (parte específica do Controller)




    // Validações dos valores (parte equivalente ao cliente)
    // if (emailsNoBanco.includes(email)) {

    // }
    // if (arrobasNoBanco.includes(arroba)) {

    // }





    // Finalização do tratamento do dado da imagem
    let dadoAvatar = avatar.files && !avatar.startsWith('data:') ?
        avatar.files[0] : path.join(__dirname, '..', 'public', 'assets', 'icon', 'usuario_comum.png'); // './assets/icon/usuario_comum.png';
    let arquivoAvatar;
    let tiposImagemPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    let limiteTamanhoImagem = 4 * 1024 * 1024; // equivale a 4MB

    let avatarMime = null; // = tipo da imagem de Avatar (.jpg, .png etc)
    let avatarBuffer = null;

    // avatar == './assets/icon/usuario_comum.png' || 
    if (avatar == undefined || dadoAvatar == null || avatar == '' || avatar.files.length == 0) {


        // usar novamente do fileReader e converter a imagem para base64
        arquivoAvatar = await new Promise((resolve, reject) => { // promise é um objeto que promete um retornar resultado no futuro, na forma de uma das suas duas funções internas, podendo ser resolve (função mais adentro funcionou) ou reject (houve erro em alguma parte do processo).

            let ler = new FileReader(); // traduzindo a definição de fileReader, é uma interface que permite a leitura assíncrona de arquivos os "data buffers" armazenados no computador do usuário final - usa-se Blob ou File para especificação do dado ou arquivo a ser lido.

            ler.onload = () => resolve(ler.result); // resolve recebe o resultado (em formato dataURL "data:image/..;base64,...") quando dá certo
            ler.onerror = (error) => reject(error); // reject recebe os erros de execução
            ler.readAsDataURL(dadoAvatar); // a conversão em si

        });


    } else {

        if (dadoAvatar == null || avatar == '' || avatar == undefined) {
            // Verificar se tentativas de inserir imagem predefinida p/ quem não escolheu nenhuma foram falhas
            return res.status(400).send("Avatar negado: tipo de arquivo inválido. São aceitos arquivos .png, .jpeg, .jpg, .gif e .webp");


        } else if (!tiposImagemPermitidos.includes(dadoAvatar.type)) {
            return res.status(400).send("Avatar negado: tipo de arquivo inválido. São aceitos arquivos .png, .jpeg, .jpg, .gif e .webp");

        } else if (dadoAvatar.size > limiteTamanhoImagem) {
            return res.status(400).send("Avatar negado: tamanho de arquivo inválido. Apenas imagens de até 4MB são aceitas");

        } else {
            // não vejo necessidade de fazer algo aqui, estando tudo certo
            arquivoAvatar = avatar;

        }


    }


    // Coletar mime e afins da imagem, continuar de onde parou.
    if (arquivoAvatar && arquivoAvatar.startsWith('data:')) {
        let matches = arquivoAvatar.match(/^data:(.+);base64,(.+)$/);

        if (matches) {
            avatarMime = matches[1]; // o tipo de imagem
            let dadosEmBase64 = matches[2]; // os dados que compõem a imagem em si, na base 64


            let buffer = Buffer.from(dadosEmBase64, 'base64');
            if (!avatarMime.startsWith('image/') || !tiposImagemPermitidos.includes(avatarMime)) {
                return res.status(400).send('Arquivo não é uma imagem ou não é de tipo permitido (png, jpg, jpeg, gif ou webp).');
            }
            if (buffer.length > limiteTamanhoImagem) {
                return res.status(400).send('Arquivo muito grande. Máx 2 MB.');
            }
            avatarBuffer = buffer;

        } else {
            // formato (totalmente) inválido
            return res.status(400).send('Formato de imagem inválido.');
        }

    }












    // Validações mequetrefe que serão provalvelmente substituídas em breve
    if (nome == undefined) {
        return res.status(400).send("Seu nome está undefined!");

    } else if (avatarBuffer == undefined) {
        return res.status(400).send("Seu arquivo de imagem avatar está undefined!");
    } else if (avatarMime == undefined) {
        return res.status(400).send("Seu tipo de arquivo de avatar está undefined!");

    } else if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    } else if (arroba == undefined) {
        return res.status(400).send("Seu arroba está undefined!");

    } else if (senha == undefined) {
        return res.status(400).send("Sua senha está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(avatarBuffer, avatarMime, nome, email, arroba, senha)
            .then(
                function (resultado) {
                    return res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    return res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


// function avatar(req, res) {

// }

module.exports = {
    autenticar,
    cadastrar
    // , avatar
}
