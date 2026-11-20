var express = require("express");
var router = express.Router();

var cartaController = require("../controllers/cartaController");

router.get('/listar', function(req, res){
    cartaController.listar(req, res);
});

router.post('/publicar/:idUsuario', function(req, res){
    cartaController.publicar(req, res);
});

module.exports = router;
