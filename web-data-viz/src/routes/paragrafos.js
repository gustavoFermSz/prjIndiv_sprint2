var express = require('express');
var router = express.Router();

var paragrafoController = require('../controllers/paragrafoController');

router.get('/:idParagrafo/imagem', function(req, res){
    paragrafoController.imagem(req, res);
});

module.exports = router;
