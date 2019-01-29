var express = require('express');
const checkAuth = require('./middlewares/checkAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuarios = require('./models/Usuarios.model');
const Comentarios = require('./models/Comentarios.model');
const multer = require('multer');
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
    var router = express.Router();
    // AUTENTICACION 
        // POST (LOGIN)
        app.post('/login',(req,res)=>{
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
                                email: usuario[0].email
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
        app.post('/signup',upload.single('fotoPerfil'), (req, res) => {
            Usuarios.find({ email: req.body.email })
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
                                usuario.fotoPerfile = req.file.path;
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
// CRUD
    // Home
        app.get('/',(req,res) =>{
            res.send('Bienvenido al mevn_crud_v2');
        })
    // POST (crear un comentario)
        app.post('/dashboard/crearcomentario',checkAuth,(req,res)=>{
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
        app.get('/dashboard',checkAuth,(req,res)=>{
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
        app.get('/dashboard/comentario/:id',checkAuth,(req,res)=>{
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
        app.put('/dashboard/comentario/:id',checkAuth,(req,res)=>{
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
        app.delete('/dashboard/comentario/:id',checkAuth,(req,res)=>{
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