var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

router.get('/listar', function(req, res){
    quizController.listar(req, res);
});

router.get('/:idQuiz/imagem', function(req, res){
    quizController.imagem(req, res);
});

router.get('/:idQuiz', function(req, res){
    quizController.buscarCompleto(req, res);
});

router.post('/criar', function(req, res){
    quizController.criar(req, res);
});

module.exports = router;
