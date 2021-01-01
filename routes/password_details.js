var express = require("express");
var router = express.Router();
var passCatModule = require("../modules/password_category");
var passModule = require("../modules/add_password");
var jwt = require("jsonwebtoken");

var getPassCat = passCatModule.find({});

function checkLogin(req, res, next) {
  var loginToken =localStorage.getItem("loginToken"); //getting credential from localstorage
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
    res.redirect("/dashboard");
  });
  
  router.get("/edit/:id", checkLogin, function (req, res, next) {
    var loginUser =req.session.userName
    var id = req.params.id;
  
    var getPassDetails = passModule.findById({ _id: id });
    getPassDetails.exec(function (err, data) {
      if (err) throw err;
      getPassCat.exec(function (err, data1) {
        res.render("edit_password_details", {
          title: "Password Management System",
          loginUser: loginUser,
          records: data1,
          record: data,
          success: "",
        });
      });
    });
  });
  router.post("/edit/:id", checkLogin, function (
    req,
    res,
    next
  ) {
    var loginUser = localStorage.getItem("loginUser");
    var id = req.params.id;
    var passcat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
  
    passModule
      .findByIdAndUpdate(id, {
        choose_category: passcat,
        project_name: project_name,
        password_detail: pass_details,
      })
      .exec(function (err) {
        if (err) throw err;
        var getPassDetails = passModule.findById({ _id: id });
        getPassDetails.exec(function (err, data) {
          if (err) throw err;
          getPassCat.exec(function (err, data1) {
            res.render("edit_password_details", {
              title: "Password Management System",
              loginUser: loginUser,
              records: data1,
              record: data,
              success: "Password Updated Successfully",
            });
          });
        });
      });
  });
  router.get("/delete/:id", checkLogin, function (
    req,
    res,
    next
  ) {
    var loginUser = req.session.userName
  
    var id = req.params.id;
    var passdel = passModule.findByIdAndDelete(id);
    passdel.exec(function (err) {
      //data not returned in delete
      if (err) throw err;
  
      res.redirect("/view_all_password");
    });
  });

  module.exports = router;