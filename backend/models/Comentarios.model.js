const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogEsquema = new Schema({
    titulo: String,
    comentario: String,
    refUsuario:[{type:Schema.Types.ObjectId, ref:'Usuarios'}]
},{timestamps:true,versionKey:false})
module.exports = mongoose.model('Comentarios',BlogEsquema);