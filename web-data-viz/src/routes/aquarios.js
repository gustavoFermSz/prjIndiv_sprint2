var express = require("express");
var router = express.Router();

var aquarioController = require("../controllers/aquarioController");

// router.get("/:empresaId", function (req, res) {   <---- não sei a diferença de usar esses : depois de / no começo da rota
router.get("/:aquarios", function (req, res) {
  aquarioController.buscarAquariosPorEmpresa(req, res);
});

router.post("/cadastrar", function (req, res) {
  aquarioController.cadastrar(req, res);
})

module.exports = router;