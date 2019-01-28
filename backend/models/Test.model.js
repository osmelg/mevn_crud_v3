const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TestEsquema = new Schema({
    imagen: String,
},{timestamps:true,versionKey:false})
module.exports = mongoose.model('Test',TestEsquema);