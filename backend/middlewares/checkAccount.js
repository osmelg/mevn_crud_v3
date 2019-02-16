const Usuarios = require('../models/Usuarios.model');
module.exports = (req, res, next) => {
    // // 1. Verificar si el usuario existe
    Usuarios.find({ email: req.body.email })
        .then(usuario => {
            if (usuario[0].confirmedAccount === true) {
                // res.status(200).json({ rs: 'usuarioConfirmado' });
                next();
            } else {
                res.json({ rs: 'usuarioNoConfirmado' });
            }
        })
}