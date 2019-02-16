require('dotenv').config();
const checkAuth = require('../middlewares/checkAuth');
const Comentarios = require('../models/Comentarios.model');
const express = require('express');
const router = express.Router();
// BLOG CRUD
    // Home
        router.get('/',(req,res) =>{
            res.send('Bienvenido al mevn_crud_v3');
        })
    // Crear un comentario
        router.post('/dashboard/crearcomentario',checkAuth,(req,res)=>{
            // 1. Recibir datos
            const comentario = new Comentarios();
                comentario.titulo = req.body.titulo;
                comentario.comentario = req.body.comentario;
                comentario.save(function(error){
                    if (error){res.json({rs:'errorCrearComentario'});
                    }else{
                        res.json({rs:'comentarioCreado'});
                    }
                })
        })            
    // Obtener todos los comentarios
        router.get('/dashboard',checkAuth,(req,res)=>{
            // 1. Buscar todos los comentarios
            Comentarios.find({})
                .exec(function(error,comentarios){
                    if(error){
                        res.json({rs:'getComentariosError'})
                    }else{
                        res.json(comentarios);
                    }
                })
        })
    // Obtener un comentario
        router.get('/dashboard/comentario/:id',checkAuth,(req,res)=>{
            // 1. Buscar comentario
            Comentarios.findOne({
                _id:req.params.id
            })
            .exec(function(error,comentario){
                if(error){
                    res.json({rs:'getComentarioError'});
                }
                else{
                    res.json(comentario);
                }
            })
        })            
    // Actualizar comentario
        router.put('/dashboard/comentario/:id',checkAuth,(req,res)=>{
            // 1. Recibir y actualizar comentario
            Comentarios.findOneAndUpdate({_id:req.params.id},
            {$set:{titulo:req.body.titulo,comentario:req.body.comentario}},{upsert:true},function(error,comentarioActualizado){
                if(error){
                    res.json({rs:'comentarioActualizadoError'});
                }else{
                    res.json({rs:'comentarioActualizado'});
                }
            })
        })
    // Eliminar comentario
        router.delete('/dashboard/comentario/:id',checkAuth,(req,res)=>{
            Comentarios.findOneAndDelete({
                _id:req.params.id
            },(error,comentarioEliminado)=>{
                if(error){
                    res.json({rs:'comentarioEliminadoError'})
                }else{
                    res.json({rs:'comentarioEliminado'})
                }
            })
        }) 
// Exportar rutas
    module.exports = router;         