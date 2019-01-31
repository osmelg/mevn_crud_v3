const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    try {
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.userChecked = decoded;
        next();
    } catch (error) {
        console.log(error);
    }
}
