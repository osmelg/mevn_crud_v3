const checkAuth = require('./middlewares/checkAuth');
const checkForgot = require('./middlewares/checkForgot');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuarios = require('./models/Usuarios.model');
const Comentarios = require('./models/Comentarios.model');
const multer = require('multer');
const nodemailer = require('nodemailer');
const express = require('express');
// Validaciones para multer
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './upload/')
            },
            filename: function (req, file, cb) {
            cb(null,file.originalname);
            }
        })
    const fileFilter = (req,file,cb)=>{
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            cb(null,true);
        }else{
            cb(null,false);
        }
    } 
    const upload = multer({storage:storage,limits:{fileSize:1024*1024*5},fileFilter:fileFilter});
// Rutas
    const router = express.Router();
    // AUTENTICACION 
        // POST (LOGIN)
            router.post('/login',(req,res)=>{
                Usuarios.find({email:req.body.email})
                .exec()
                .then(usuario =>{
                    if (usuario.length < 1){
                        return res.status(401).json({
                            rs:'emailIncorrecto'
                            })
                    }
                    bcrypt.compare(req.body.password,usuario[0].password,(err,usuarioEncontrado)=>{
                        if (err){
                            return res.status(401).json({
                                rs: 'errorIncriptacion'
                            })
                        }
                        if (usuarioEncontrado){
                            const token = jwt.sign(
                                {
                                    nombre: usuario[0].nombre,
                                    email: usuario[0].email,
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "600s"
                                }
                            );
                            return res.status(200).json({
                                rs: "usuarioLogeado",
                                token: token
                            });
                        }
                        res.status(401).json({
                            rs:'passwordIncorrecto'
                        })
                    })
                })
            })
        // POST (SIGN UP)
            router.post('/signup',upload.single('fotoPerfil'), (req, res) => {
                Usuarios.find({email: req.body.email})
                    .exec()
                    .then(usuario => {
                        if (usuario.length >= 1) {
                            return res.status(401).json({
                                rs: 'emailExiste'
                            })
                        } else if (usuario.length < 1){
                            bcrypt.hash(req.body.password, 10, (error, passwordCifrado) => {
                                if (error) {
                                    return res.status(500).json({rs:'errorEncriptacion'})
                                } if(passwordCifrado) {
                                    const usuario = new Usuarios();
                                    usuario.nombre = req.body.nombre;
                                    usuario.fotoPerfil = req.file.path;
                                    usuario.email = req.body.email;
                                    usuario.password = passwordCifrado;
                                    usuario.creadoEn = new Date();
                                    usuario.confirmacionCuenta = false;
                                    usuario.save(function (error) {
                                        if (error) {
                                            res.json({ error: 'error' });
                                        } else {
                                            jwt.sign({nombre:usuario.nombre},'secret',{expiresIn:'300s'},(err,token)=>{
                                                res.json({
                                                    rs: 'usuarioCreado',
                                                    token:token
                                                })
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
            })        
        // FORGOT PASSWORD
            router.post('/forgot', (req, res) => {
                // 1. Crear token
                const token = jwt.sign(
                    {
                        email: usuario[0].email //este parametro de donde lo va a tomar?
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                res.status(200).json({rs:'tokenCreado',token:token});
                // o asi ? pero el foo bar? Probar el sign up quitando el foo bar de ahi
                // const token = jwt.sign({ foo: 'bar' }, 'secret');
                // o asi?
                jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: 'foobar'
                  }, 'secret');
                // 2. Buscar si existe el email
                Usuarios.findOne({email:req.body.email})
                    .exec() // funciona igual sino se coloca ?
                    .then(usuario => {
                        if (!usuario) {res.json({rs:'noUserFound'})}
                        usuario.resetToken = token;
                        usuario.resetTokenExpiration = Date.now() + 3600000;
                        return usuario.save();
                        //se podra retornar el id por aqui? 
                    })
                    .then(result => {
                        var transporter = nodemailer.createTransport({
                            service: process.env.SERVICE,
                            auth: { user: process.env.USER, pass: process.env.PASSWORD }
                        });
                        var mailOptions = {
                            from: process.env.USER,
                            to: req.body.emailTo,
                            subject: 'Password Reset',
                            html:
                                `
                                    <h1>Click the link below to reset your password</h1>
                                    <h6>This url will expired in 1 hour</h6>
                                    <a href='localhost:8080/reset/${token}'>Reset Password</a>
                                `
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                res.json({ rs: 'emailEnviado' });
                            }
                        });
                    })
                    .catch(err => {
                        console.log(error);
                    })
            })
        // RESET PASSWORD
            router.get('reset/:token',checkForgot,(req,res)=>{
                // 1. Obtener el token por el parametro
                const token = req.params.token;
                Usuario.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
                        .exec()
                        .then(usuario=>{
                              //como pasar el id?
                        })
                        .catch(error =>{
                            console.log(error);
                        })
            }) 
    // CRUD
        // Home
            router.get('/',(req,res) =>{
                res.send('Bienvenido al mevn_crud_v2');
            })
        // POST (crear un comentario)
            router.post('/dashboard/crearcomentario',checkAuth,(req,res)=>{
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
        // GET - (obtener comentarios)   
            router.get('/dashboard',checkAuth,(req,res)=>{
                Comentarios.find({})
                    .exec(function(error,comentarios){
                        if(error){
                            res.json({rs:'getComentariosError'})
                        }else{
                            res.json(comentarios);
                        }
                    })
            })
        // GET (Obtener un comentario)
            router.get('/dashboard/comentario/:id',checkAuth,(req,res)=>{
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
        // PUT - (Actualizar comnetario)
            router.put('/dashboard/comentario/:id',checkAuth,(req,res)=>{
                Comentarios.findOneAndUpdate({
                    _id:req.params.id
                },
                {$set:{titulo:req.body.titulo,comentario:req.body.comentario}},{ upsert: true },function(error,comentarioActualizado){
                    if(error){
                        res.json({rs:'putComentarioActualizadoError'});
                    }else{
                        res.json({rs:'comentarioActualizado'});
                    }
                })
            })
        // DELETE 
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