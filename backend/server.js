// Llamado de modulos
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const checkAuth = require('./middlewares/checkAuth');
    const mongoose = require('mongoose');
    const Usuarios = require('./models/Usuarios.model');
    const Comentarios = require('./models/Comentarios.model');
    const routes = require('./routes.js');
    const express = require('express');
    
// Inicializamos express
    var app = express();
// Levantando el servidor
    app.listen('3000',() =>{
        console.log('servidor iniciado');
    })
// Llamando a los middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(cors());
    app.use('/', routes);
    app.use('/login', routes);
    app.use('/signup', routes);
    app.use('/dashboard/crearcomentario', routes);
    app.use('/dashboard', routes);
    app.use('/dashboard/comentario/:id', routes);
    // Comprobar si funciona la misma ruta para readone,put y delete
// Mongoose
    mongoose.connect('mongodb://localhost/mevn_crud_login_bcrypt_jwt',{useNewUrlParser:true},(error)=>{
        if(error){
            throw error;
        }else{
            console.log('conectado a mongoDB');
        }
    })