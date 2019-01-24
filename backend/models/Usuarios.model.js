const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogEsquema = new Schema({
    nombre: String,
    email: String,
    password: String,
    confirmacionCuenta: Boolean,
    creadoEn: String
},{versionKey:false})
module.exports = mongoose.model('Usuarios',BlogEsquema);