const mongoose = require('mongoose');
const Schema = mongoose.Schema;
<<<<<<< HEAD
const TestEsquema = new Schema({
=======
const UsuarioEsquema = new Schema({
>>>>>>> master
    nombre: String,
    fotoPerfil: String,
    email: String,
    password: String,
    confirmacionCuenta: Boolean,
<<<<<<< HEAD
    refComentario:[{type:Schema.Types.ObjectId, ref:'Comentarios'}]
},{timestamps:true,versionKey:false})
module.exports = mongoose.model('Usuarios',TestEsquema);
=======
    creadoEn: String
},{versionKey:false})
module.exports = mongoose.model('Usuarios',UsuarioEsquema);
>>>>>>> master
