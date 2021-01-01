var express = require("express");
var router = express.Router();
var passCatModule = require("../modules/password_category");
var passModule = require("../modules/add_password");
var jwt = require("jsonwebtoken");

var getPassCat = passCatModule.find({});

function checkLogin(req, res, next) {
  var loginToken = localStorage.getItem("loginToken");//getting credential from localstorage
  try {
    if(req.session.userName){
      var decode = jwt.verify(loginToken, "loginToken");
    }
    else{
      res.redirect("/");
    }
   
  } catch (err) {
    
  }
  next(); //passing control to next mthod
}

  if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch"); //creation of new(./scratch folder which stores credentials in hashed form) local storage
  }

  router.get("/", checkLogin, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
  
    getPassCat.exec(function (err, data) {
      //for making option of choosing pass category dynamic
      if (err) throw err;
      res.render("addNewPassword", {
        title: "Password Management System",
        loginUser: loginUser,
        records: data,
        success: "",
      });
    });
  });

  router.post("/", checkLogin, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
  
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;

    if( pass_cat == "" || project_name =="" ||  pass_details==""){

      getPassCat.exec(function (err, data) {
        //for making option of choosing pass category dynamic
        if (err) throw err;

        res.render("addNewPassword", {
          title: "Password Management System",
          loginUser: loginUser,
          records: data,
          success: "All Fields Are Required",
        });
       
        });


    }else{
  
    var password_details = new passModule({
      choose_category: pass_cat,
      project_name: project_name,
      password_detail: pass_details,
    });

  
    password_details.save(function (err, doc) {
      if (err) throw err;
      getPassCat.exec(function (err, data) {
        //get inside save mthod to refresh the data
        if (err) throw err;

          res.render("addNewPassword", {
            title: "Password Management System",
            loginUser: loginUser,
            records: data,
            success: "Password Details Inserted Successfully",
          });
        
      });
    });
  }
  });

  module.exports = router;