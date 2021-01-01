var express = require("express");
var router = express.Router();
var userModule = require("../modules/user");
var passCatModule = require("../modules/password_category");
var jwt = require("jsonwebtoken");

var getPassCat = passCatModule.find({});

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

  function checkEmail(req, res, next) {
    var email = req.body.email;
    var checkexistingemail = userModule.findOne({ email: email });
    checkexistingemail.exec((err, data) => {
      if (err) throw err;
      if (data) {
        return res.render("signup", {
          title: "Password Management System",
          msg: "Email Already Exists",
        }); //root should be returned here unless process stops nd error will be thrown then we hve to restart it
      }
      next();
    });
  }
  
  function checkUsername(req, res, next) {
    var username = req.body.uname;
    var checkexistingusername = userModule.findOne({ username: username });
    checkexistingusername.exec((err, data) => {
      if (err) throw err;
      if (data) {
        return res.render("signup", {
          title: "Password Management System",
          msg: "Username Already Exists",
        }); //root should be returned here unless process stops nd error will be thrown then we hve to restart it
      }
      next();
    });
  }

  router.get("/", checkLogin, function (req, res, next) {
    var loginUser = req.session.userName;
    getPassCat.exec(function (err, data) {
      if (err) throw err;
  
      res.render("password_category", {
        title: "Password Management System",
        loginUser: loginUser,
        records: data,
      });
    });
  });

  router.get("/delete/:id", checkLogin, function (
    req,
    res,
    next
  ) {
    var loginUser =req.session.userName
  
    var passcat_id = req.params.id;
    var passdel = passCatModule.findByIdAndDelete(passcat_id);
    passdel.exec(function (err) {
      //data not returned in delete
      if (err) throw err;
  
      res.redirect("/passwordCategory");
    });
  });

  router.get("/edit/:id", checkLogin, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
  
    var passcat_id = req.params.id;
    var getpassCategory = passCatModule.findById(passcat_id);
    getpassCategory.exec(function (err, data) {
      //data not returned in delete
      if (err) throw err;
      res.render("edit_pass_category", {
        title: "Password Management System",
        loginUser: loginUser,
        errors: "",
        success: "",
        records: data,
        id: passcat_id,
      });
    });
  });

  router.post("/edit/", checkLogin, function (req, res, next) {
    var loginUser =req.session.userName
  
    var passcat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory;
  
    var update_passCat = passCatModule.findByIdAndUpdate(passcat_id, {
      password_category: passwordCategory,
    });
  
    update_passCat.exec(function (err, data) {
      //data not returned in delete
      if (err) throw err;
      res.redirect("/passwordCategory");
    });
  });

  module.exports = router;