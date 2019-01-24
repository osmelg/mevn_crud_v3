var express = require('express');
var router = express.Router();

// Creando las rutas
    router.get('/', function(req, res) {
        res.send('hola');
    });
    router.get('/about', function(req, res) {
        res.send('hola2');
    });
// Exportando las rutas
    module.exports = router;