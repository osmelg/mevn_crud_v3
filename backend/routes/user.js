require('dotenv').config();
const checkForgot = require('../middlewares/checkForgot');
const checkAccount = require('../middlewares/checkAccount');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios.model');
const multerConfig = require('../middlewares/multerConfig');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
// AUTENTICACION DE USUARIOS
    // ACCESO 
        router.post('/login',checkAccount,(req,res)=>{
            // 0. Verificar datos del cliente
            // 1. Verificar si usuario existe
            Usuarios.find({email:req.body.email})
            .then(usuario =>{
                if (usuario.length < 1){
                    return res.status(401).json({rs:'emailIncorrecto'})
                }
                // 2. Comparar contraseña con respecto a mongo
                bcrypt.compare(req.body.password,usuario[0].password,(err,usuarioEncontrado)=>{
                    if (err){return res.status(401).json({rs: 'errorIncriptacion'})
                    }
                    if (usuarioEncontrado){
                        // 3. Creacion de token retornando datos del usuario (si es necesario)
                        const token = jwt.sign(
                            {
                                userId: usuario[0]._id,
                                email: usuario[0].email
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "48h"
                            }
                        );
                        return res.json({
                            rs: "usuarioLogeado",
                            token: token
                        });
                    }
                    return res.status(401).json({
                        rs:'passwordIncorrecto'
                    })
                })
            })
        })
    // REGISTRO
        // Creacion de cuenta
            router.post('/signup',multerConfig.upload.single('fotoPerfil'),(req,res)=>{
                // 1. Se verifica si existe un usuario registrado con el email recibido
                Usuarios.find({email:req.body.email})
                    .exec()
                    .then(usuario=>{
                        if (usuario.length >= 1) {return res.status(401).json({rs:'emailExiste'})
                        } else if (usuario.length < 1){
                            // 2. Se encripta el password recibido
                            bcrypt.hash(req.body.password, 10, (error, passwordCifrado) => {
                                if (error){return res.status(500).json({rs:'errorEncriptacion'})
                                }if(passwordCifrado){
                                    // 3. Agregar datos en mongo
                                    const usuario = new Usuarios();
                                    usuario.nombre = req.body.nombre;
                                    usuario.email = req.body.email;
                                    usuario.password = passwordCifrado;
                                    usuario.confirmedAccount = false;
                                    // Validacion de insercion de imagen
                                    if (!req.file){usuario.fotoPerfil = 'upload\\default.jpg';}else{usuario.fotoPerfil = req.file.path;}
                                    usuario.save(function (error) {
                                        if(error){res.json({error:'error'})
                                        }else{
                                            // var newObject = this.user;
                                            // newObject.
                                            // *-* Se debe eliminar el password del objeto que se va a devolver
                                            // var obj = this.usuario();
                                            // delete obj.password
                                            // 4. Creacion y almacenamiento de token en mongo
                                            jwt.sign({ email: usuario.email }, 'secret', (err, token) => {
                                                usuario.confirmToken = token;
                                                usuario.save();
                                                // *-* se puede separar transporter de aqui?
                                                // 5. Envio de token de confirmacion mediante email
                                                var transporter = nodemailer.createTransport({
                                                    service: process.env.SERVICE,
                                                    auth: { user: process.env.USER, pass: process.env.PASSWORD }
                                                });
                                                var mailOptions = {
                                                    from: process.env.USER,
                                                    to: req.body.email,
                                                    subject: 'Confirm Account',
                                                    html:
                                                        `   <h1 style="text-align: center;">Click the link below to confirm your account</h1>
                                                            <h3 style="text-align: center;"><a href="http://localhost:8080/confirm/${token}">Confirm Sign Up</a></h3>
                                                        `
                                                };
                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {
                                                        res.json({ error: error })
                                                    } else {
                                                        console.log('emailEnviado');
                                                    }
                                                })
                                                res.json({ rs: 'usuarioCreado', token }) // este es del token
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                    .catch(error =>{
                        console.log(error);
                    })
            })
        // Confirmar cuenta
            router.get('/confirm/:token',checkForgot,(req,res)=>{
                // 1. Tomar token 
                const confirmToken = req.params.token;
                // 2. Buscar token en mongo
                Usuarios.findOneAndUpdate({
                    confirmToken:confirmToken
                },
                {$set:{confirmToken:null,confirmedAccount:true}},{ upsert: true },function(error,usuario){
                    if(error){
                        res.json(error)
                    }else{
                        // 3. Creacion de token de sesion, agregando al token email de usuario
                        const token = jwt.sign(
                            {
                                email: usuario.email
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "24h"
                            }
                        );
                        res.status(200).json({rs:'usuarioConfirmado',token:token});
                    }
                })           
            })
// CAMBIAR PASSWORD
    // Contraseña olvidada
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
                    // })
                    // .then(result => {
                        // 3. Enviar token por email
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
    // Reiniciar contraseña
        // GET
            router.get('/reset/:token',checkForgot,(req,res)=>{
                // 1. Recibir token
                const resetToken = req.params.token;
                // 2. Buscar token en mongo
                Usuarios.findOne({resetToken:resetToken})
                        .exec()
                        .then(usuario=>{
                            const usuarioId = usuario._id;
                            // *-* VERIFICAR el TOSTRING
                            const theid = usuarioId.toString();
                            res.json({rs:theid})
                        })
                        .catch(error =>{
                            console.log(error);
                        })
            }) 
        // POST 
            router.post('/reset',(req,res) =>{
                // 1. Recibir y encriptar password
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {res.status(500).json({error:err})
                } else {
                    // 2. Recibir id y actualizar datos
                    Usuarios.findOneAndUpdate({
                        _id:req.body.id
                    },
                    {$set:{password:hashedPassword,resetToken:null}},{ upsert: true },function(error,usuarioActualizado){
                        if(error){
                            res.json({rs:'putPasswordActualizadoError'});
                        }else{
                            const token = jwt.sign(
                                {
                                    nombre: usuarioActualizado.nombre,
                                    email: usuarioActualizado.email,
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "48h"
                                }
                            );
                            res.status(200).json({rs:'PasswordActualizado',token: token});
                        }
                    })
                    }
                })
            })
// Datos de Usuario
    // Obtener datos de usuario
        router.get('/profile/:id',(req,res)=>{
            // 1. Buscar comentario
            Usuarios.findOne({
                _id:req.params.id
            })
            .exec(function(error,usuario){
                if(error){
                    res.json({rs:'usuarioError'});
                }
                else{
                    res.json(usuario);
                }
            })
        })  
// COPIA DE ACCESO
// router.post('/login',(req,res)=>{
//     // 0. Verificar datos del cliente
//     // 1. Verificar si usuario existe
//     Usuarios.find({email:req.body.email})
//     .then(usuario =>{
//         if (usuario.length < 1){
//             return res.status(401).json({rs:'emailIncorrecto'})
//         }
//         // 2. Comparar contraseña con respecto a mongo
//         bcrypt.compare(req.body.password,usuario[0].password,(err,usuarioEncontrado)=>{
//             if (err){return res.status(401).json({rs: 'errorIncriptacion'})
//             }
//             if (usuarioEncontrado){
//                 // 3. Creacion de token retornando datos del usuario (si es necesario)
//                 const token = jwt.sign(
//                     {
//                         userId: usuario[0]._id,
//                         email: usuario[0].email
//                     },
//                     process.env.JWT_KEY,
//                     {
//                         expiresIn: "48h"
//                     }
//                 );
//                 return res.json({
//                     rs: "usuarioLogeado",
//                     token: token
//                 });
//             }
//             return res.status(401).json({
//                 rs:'passwordIncorrecto'
//             })
//         })
//     })
// })
// Exportar rutas
    module.exports = router;  