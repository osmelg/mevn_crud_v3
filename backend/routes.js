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
                                    if (usuario.fotoPerfil === undefined){
                                        usuario.fotoPerfil = 'upload\\O s m e L.jpg';
                                    }else{
                                        usuario.fotoPerfil = req.file.path;    
                                    }
                                    usuario.email = req.body.email;
                                    usuario.password = passwordCifrado;
                                    usuario.confirmacionCuenta = false;
                                    usuario.save(function (error) {
                                        if (error) {
                                            res.json({ error: 'error' });
                                        } else {
                                            jwt.sign({usuario:usuario.nombre},'secret',{expiresIn:'300s'},(err,token)=>{
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
        // CHANGE PASSWORD
            // FORGOT PASSWORD
                router.post('/forgot', (req, res) => {
                    // 1. Crear token
                        const token = jwt.sign({},process.env.JWT_KEY,{expiresIn: "1h"});
                    // 2. Buscar si existe el email
                        Usuarios.findOne({email:req.body.emailTo})
                            .exec() // funciona igual sino se coloca ?
                            .then(usuario => {
                                if (!usuario) {res.json({rs:'emailNoExiste'})}
                                usuario.resetToken = token;
                                usuario.save();
                            })
                            .then(result => {
                                var transporter = nodemailer.createTransport({
                                    service: process.env.SERVICE,
                                    auth:{user:process.env.USER,pass:process.env.PASSWORD}
                                });
                                var mailOptions = {
                                    from: process.env.USER,
                                    to: req.body.emailTo,
                                    subject: 'Password Reset',
                                    html:
                                        `   <h1 style="text-align: center;">Click the link below to reset your password</h1>
                                            <h2 style="text-align: center;">Link expire in 1 hour</h2>
                                            <h3 style="text-align: center;"><a href="http://localhost:8080/reset/${token}">Reset</a></h3>
                                        `
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        res.json({error:error})
                                    } else {
                                        res.json({rs:'emailEnviado'});
                                    }
                                });
                            })
                            .catch(error => {
                                res.json({error:error})
                            })
                })
            // RESET PASSWORD
                // GET xq no agarra el cliente el token?
                    router.get('/reset/:token',(req,res)=>{
                        // 1. Obtener el token por el parametro
                            const resetToken = req.params.token;
                            console.log(resetToken);
                        // 2. verificar tiempo de expiracion el token
                            // ya se pasa como middleware
                        // 3. verificar token con respecto a la bdd y retornar id al cliente
                        // res.json({rs:'getComentariosError'})
                            Usuarios.findOne({resetToken:resetToken})
                                    .exec()
                                    .then(usuario=>{
                                        const usuarioId = usuario._id;
                                        const theid = usuarioId.toString();
                                        console.log(theid);
                                        res.json({rs:theid})
                                    })
                                    .catch(error =>{
                                        console.log(error);
                                    })
                    }) 
                // POST
                    router.post('/reset',(req,res) =>{
                        // 1. envia el nuevo password con el id
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({error:err})
                            } else {
                                Usuarios.findOneAndUpdate({
                                    _id:req.body.id
                                },
                                {$set:{password:hash,resetToken:null}},{ upsert: true },function(error,PasswordActualizado){
                                    if(error){
                                        res.json({rs:'putPasswordActualizadoError'});
                                    }else{
                                        res.json({rs:'PasswordActualizado'});
                                    }
                                })
                            }
                        })

                    })
    // CRUD
        // Home
            router.get('/',(req,res) =>{
                res.send('Bienvenido al mevn_crud_v3');
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