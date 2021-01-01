var express = require("express");
var router = express.Router();
var passCatModule = require("../modules/password_category");
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator"); //express validator for validating if password category is empty or not and hence show relevent message

function checkLogin(req, res, next) {
  var loginToken =localStorage.getItem("loginToken");//getting credential from localstorage
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

  function checkCategory(req, res, next) {
    var passCatName = req.body.passwordCategory;
    var checkexistingPassCat = passCatModule.findOne({ password_category:passCatName });
    checkexistingPassCat.exec((err, data) => {
      if (err) throw err;
      if (data) {
        return res.render("addNewCategory", {
          title: "Password Management System",
          loginUser:'',
          errors:'',
          error: "Password Category Already Exists",
          success: "",

        }); //root should be returned here unless process stops nd error will be thrown then we hve to restart it
      }
      next();
    });
  }
  

  router.get("/", checkLogin, checkCategory,function (req, res, next) {
    var loginUser = req.session.userName
  
    res.render("addNewCategory", {
      title: "Password Management System",
      loginUser: loginUser,
      errors: '',
      error:'',
      success: "",
    });
  });

  router.post(
    "/",
    checkLogin,checkCategory,
    [
      check("passwordCategory", "Enter Password Category Name").isLength({
        min: 1,
      }),
    ],
    function (req, res, next) {
      var loginUser = req.session.userName
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("addNewCategory", {
          title: "Password Management System",
          loginUser: loginUser,
          errors: errors.mapped(),//express validatore
          error:'',
          success: "",
        });
      } else {
        var passCatName = req.body.passwordCategory;
        var passcatDetails = new passCatModule({
          password_category: passCatName,
        });
        passcatDetails.save(function (err, data) {
          if (err) throw err;
          res.render("addNewCategory", {
            title: "Password Management System",
            loginUser: loginUser,
            errors: "",
            error:'',
            success: "Password Inserted Successfully",
          });
        });
      }
    }
  );
  
  module.exports = router;