var userModule = require("../../modules/user");
const bcrypt = require('bcrypt');//used while signup to hash password and to match password while logging in
var jwt = require('jsonwebtoken');
require('dotenv').config()

// var jwtSecret =  process.env.jwtSECRETkey

exports.signup=(req, res, next) => {

    var username = req.body.username; 
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    if(password !== confirmPassword){
        res.json({
            message: "Password Not Matched",
        });

    }else{

        //bcrypt the password(two mthods synchronous &asy.. r available,we r using syc..)
     
        bcrypt.hash(password,10,(err,hash)=>{
            if(err){
                return res.json({
                    message:"Something Went Wrong, Try Later",
                    errors:err
                })
            
            }else{
                var userDetails = new userModule({
                    username: username,
                    email: email,
                    password: hash,
                });
            
                userDetails.save()
                    .then((doc) => {
                        res.status(201).json({
                            message: "User Registered Successfully",
                            result: doc,
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });

            }

        })
    }
}

exports.login=(req, res, next) => {

    var username = req.body.username; 
    var password = req.body.password;


    userModule.find({username:username})
    .exec()
    .then(user=>{
        if(user.length<1){
            res.status(404).json({
                message:"Auth Failed",
            })
        }else{
            bcrypt.compare(password, user[0].password, function(err, result) {
                if(err){
                    res.status(404).json({
                        message:"Auth Failed",
                    })
                }

                if(result){

                    console.log(password);

                    //below token generation follws algorithm HS256 that we r using
                    var token = jwt.sign({ 
                        //payload
                        username:user[0].username,
                        userId:user[0]._id,
                     },
                    //secretOrPrivateKey 
                    process.env.jwtSECRETkey,
                    {
                        expiresIn:"1h"//[options, callback]
                    });
                    res.status(201).json({
                        message:"User Found",
                        token:token//the token returned contains username & userid as passed above in payload
                    })
                }else{
                    res.status(404).json({
                        message:"Auth Failed",
                    })
                }
            });
           
        }
    
    }).catch(err=>{
        res.json({
            errors:err
        })
    })
            
}