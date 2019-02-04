const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsuarioEsquema = new Schema({
    nombre: String,
    fotoPerfil: String,
    email: String,
    password: String,
    confirmedAccount: Boolean,
    resetToken: String,
    confirmToken: String,
    refComentario:[{type:Schema.Types.ObjectId, ref:'Comentarios'}]
},{timestamps:true,versionKey:false})
module.exports = mongoose.model('Usuarios',UsuarioEsquema);