const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{
        // se utiliza split para obtener el token y elimianr la palabra Bearer
        // se utiliza split para separar los elementos
        // el array 1 es para obtener el segundo elemento el cual es el token sin la palabra bearer
        const token = req.headers.authorization.split(" ")[1]; 
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.userData = decoded;
        next()
    }catch(error){
        return res.status(401).json({
            rs:'tokenExpired'
        })
    }
}