var express = require("express");
var router = express.Router();
// ESTE ARQUIVO SÓ SERÁ USADO PARA BASEAR ESTRUTURA E NÍVEL DE COMPLEXIDADE (QUAIS FUNÇÕES E COMO) SERÃO USADAS NA APLICAÇÃO FICSIETE, ENTIDADES NÃO CONSTANTES NAS TABELAS DE script-ficsiete.sql NÃO DEVEM SER CONSIDERADAS PARA USO EFETIVO NO CÓDIGO!
var aquarioController = require("../controllers/aquarioController");

// router.get("/:empresaId", function (req, res) {   <---- a diferença de usar esses : depois de / no começo da rota é que só a barra == rota fixa, enquanto /: == qualquer rota leva a esse caminho, o que permite sempre passar por sua model e controller, independentemente do caminho/funcionalidade acionado inicialmente
router.get("/aquarios", function (req, res) {
  aquarioController.buscarAquariosPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  aquarioController.cadastrar(req, res);
})

module.exports = router;