var express = require("express");
var router = express.Router();

var publicacaoController = require("../../src/controllers/publicacaoController");

router.get("/listar", function (req, res) {
    publicacaoController.listar(req, res);
});

router.get("/:idPublicacao/capa", function (req, res) {
    publicacaoController.capa(req, res);
});

router.get("/:idPublicacao", function (req, res) {
    publicacaoController.buscarPorId(req, res);
});

router.get("/:idPublicacao/paragrafo/:idParagrafo/img", function(req, res){
    publicacaoController.paragrafoImagem(req, res);
});

router.post("/publicar/:idUsuario", function (req, res) {
    publicacaoController.publicar(req, res);
});

router.put('/editar/:idPublicacao', function(req, res){
    publicacaoController.editar(req, res);
});

router.delete('/deletar/:idPublicacao', function(req, res){
    publicacaoController.deletar(req, res);
});

module.exports = router;
