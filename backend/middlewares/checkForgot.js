const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    try {
        const decoded = jwt.verify(req.params.token,process.env.JWT_KEY);
        //req.userChecked = decoded; //funcion de esta linea?
        next();
    } catch (error) {
        res.status(400).json({rs:'tokenExpired',error:error})
    }
}
