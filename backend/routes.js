var express = require('express');
var router = express.Router();
// Rutas
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
                                    email: usuario[0].email
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "300s"
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
            router.post('/signup', (req, res) => {
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
                                    usuario.email = req.body.email;
                                    usuario.password = passwordCifrado;
                                    usuario.creadoEn = new Date();
                                    usuario.confirmacionCuenta = false;
                                    usuario.save(function (error) {
                                        if (error) {
                                            res.json({ error: 'error' });
                                        } else { // nombre(front):usuario.nombre(back)
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
        router.get('/',(req,res) =>{
            res.send('Bienvenido al Back End de el Mevn Crud Completo + Bcrypt + JWT');
        })
    // POST (crear un comentario)
        router.post('/dashboard/crearcomentario',checkAuth,(req,res)=>{
            const comentario = new Comentarios();
                  comentario.titulo = req.body.titulo;
                  comentario.comentario = req.body.comentario;
                  comentario.creadoEn = new Date();
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