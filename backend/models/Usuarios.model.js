const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TestEsquema = new Schema({
    nombre: String,
    fotoPerfil: String,
    email: String,
    password: String,
    confirmacionCuenta: Boolean,
    refComentario:[{type:Schema.Types.ObjectId, ref:'Comentarios'}]
},{timestamps:true,versionKey:false})
module.exports = mongoose.model('Usuarios',TestEsquema);