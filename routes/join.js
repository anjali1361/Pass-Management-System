var express = require("express");
var router = express.Router();
var passModule = require("../modules/add_password");
var jwt = require("jsonwebtoken");

function checkLogin(req, res, next) {
  var loginToken = localStorage.getItem("loginToken"); //getting credential from localstorage
  try {
    if(req.session.userName){
      var decode = jwt.verify(loginToken, "loginToken");
    }
    else{
      res.redirect("/");
    }
   
  } catch (err) {
    res.redirect("/");
  }
  next(); //passing control to next mthod
}

  if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch"); //creation of new(./scratch folder which stores credentials in hashed form) local storage
  }



  router.get("/", checkLogin, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
  
    //concept of pagination using mongoose-paginate plugin

    passModule.aggregate([
        {
            $lookup:
            {
              from:"password_categories",
              localField:"choose_category",
              foreignField:"password_category",
              as:"pass_cat_details"  
            }
        },
        {
            $unwind :"$pass_cat_details"
        }
    ]).exec(function(err,result){
     if(err) throw err;
     console.log(result);
     res.send(result);
    });
  });


  module.exports = router;