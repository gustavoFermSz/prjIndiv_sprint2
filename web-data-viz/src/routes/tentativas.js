var express = require('express');
var router = express.Router();

var tentativaController = require('../controllers/tentativaController');

// iniciar tentativa: cria registro de tentativa
router.post('/iniciar/:idQuiz', function(req, res){
    tentativaController.iniciar(req, res);
});

// registrar resposta de uma questão para uma tentativa
router.post('/:idTentativa/respostas', function(req, res){
    tentativaController.responder(req, res);
});

// finalizar tentativa
router.patch('/:idTentativa/finalizar', function(req, res){
    tentativaController.finalizar(req, res);
});

module.exports = router;
