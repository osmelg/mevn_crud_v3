// Llamado de modulos
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const routes = require('./routes.js');
    const express = require('express');
// Inicializamos express
    var app = express();
// Levantando el servidor
    app.listen('3000',() =>{
        console.log('servidor iniciado');
    })
// Middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(cors());
    app.use('/', routes);
    app.use('/login', routes);
    app.use('/signup', routes);
    app.use('/dashboard', routes);
    app.use('/dashboard/crearcomentario', routes);
    app.use('/dashboard/comentario/:id', routes);
// Mongoose
    mongoose.connect('mongodb://localhost/mevn_crud_v3',{useNewUrlParser:true},(error)=>{
        if(error){
            throw error;
        }else{
            console.log('conectado a mongoDB');
        }
    })