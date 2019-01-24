const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogEsquema = new Schema({
    titulo: String,
    comentario: String,
    creadoEn: String
},{versionKey:false})
module.exports = mongoose.model('Comentarios',BlogEsquema);