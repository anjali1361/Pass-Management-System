//Token verification ,Route protection
var jwt = require('jsonwebtoken');
require('dotenv').config()

// var jwtSecret =  process.env.jwtSECRETkey
module.exports=(req,res,next)=>{
    //getting token from header section to be used in routing via get mthod

    // var headerToken=req.headers;
    // console.log(headerToken);
try{
    var token = req.headers.authentication.split(" ")[1];
    //token will be decoded here what we passed in jwt.sign(payload) in user.js
    var decode = jwt.verify(token,process.env.jwtSECRETkey)
    req.userData= decode;//in place of userData any name is given
    next()//not proceeded ahead unless user is verified with his/her login credentials,redirected to the place where we had used this middlewares
}catch{
   res.status(401).json({
       error:"Invalid Token"
   }); 
}
}