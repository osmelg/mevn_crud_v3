// Llamado de modulos
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const userRoutes = require('./routes/user.js');
    const blogRoutes = require('./routes/blog.js');
    const expressValidator = require('express-validator');
// Inicializamos express
    const express = require('express');
    var app = express();
// Levantando el servidor
    app.listen('3000',() =>{
        console.log('servidor iniciado');
    })
// Middlewares
    // app.use(express.static('upload'));
    app.use('/upload',express.static('upload'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressValidator());
    app.use(cors());
    app.use(userRoutes);
    app.use(blogRoutes);
    // Redireccionar rutas inexistentes
        app.all('*', function (req, res) {
            res.redirect("/");
        })
// Mongoose
    mongoose.connect('mongodb://localhost/mevn_crud_v3', { useNewUrlParser: true, useFindAndModify: false }, (error) => {
        if (error) {
            throw error;
        } else {
            console.log('conectado a mongoDB');
        }
    })