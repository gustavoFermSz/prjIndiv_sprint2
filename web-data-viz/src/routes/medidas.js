var express = require("express");
var router = express.Router();
// ESTE ARQUIVO SÓ SERÁ USADO PARA BASEAR ESTRUTURA E NÍVEL DE COMPLEXIDADE (QUAIS FUNÇÕES E COMO) SERÃO USADAS NA APLICAÇÃO FICSIETE, ENTIDADES NÃO CONSTANTES NAS TABELAS DE script-ficsiete.sql NÃO DEVEM SER CONSIDERADAS PARA USO EFETIVO NO CÓDIGO!
var medidaController = require("../controllers/medidaController");

router.get("/ultimas/:idAquario", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

router.get("/tempo-real/:idAquario", function (req, res) {
    medidaController.buscarMedidasEmTempoReal(req, res);
})

module.exports = router;