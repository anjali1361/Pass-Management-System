var express = require("express");
var router = express.Router();
var passCatModule = require("../modules/password_category");
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
    var loginUser = req.session.userName;
   passModule.countDocuments({}).exec((err,count)=>{

    passCatModule.countDocuments({}).exec((err,countpasscat)=>{
      res.render("dashboard", {
        title: "Password Management System",
        loginUser: loginUser,
        msg: "",
        totalPassword:count, 
        totalPassCat:countpasscat 
      });
     })

   })
   
  });

  module.exports = router;