var express = require("express");
var router = express.Router();
var userModule = require("../modules/user");
var passCatModule = require("../modules/password_category");
var passModule = require("../modules/add_password");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var getPassCat = passCatModule.find({});
var getAllPass = passModule.find({});

/* GET home page. */

//requiring localstorage when (checks for any previous allocation to local-storage whether exist or not,if not it is created,using node-localstorage package after requiring it)
if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch"); //creation of new(./scratch folder which stores credentials in hashed form) local storage
}

//middleware to check duplicate registered credentials

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

router.get("/", function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser");

  if (req.session.userName) {
    res.redirect("./dashboard");
  } else {
    res.render("index", { title: "Password Management System", msg: "" });
  }
});

router.post("/", function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModule.findOne({ username: username });

  checkUser.exec((err, data) => {
    //here data is in form of object
    if (err) throw err;
    var getUserId = data._id;
    var getPasswordData = data.password;

    //comparing encrypted password from database to password entered for logging in

    if (bcrypt.compareSync(password, getPasswordData)) {
      var token = jwt.sign({ userID: getUserId }, "loginToken");

      //storing above token in local-storage so that we can validate while logging
      localStorage.setItem("loginToken", token);
      localStorage.setItem("loginUser", username);

      req.session.userName=username//whenever user gets logged in the username gets stored in session which is used for validate while logging,for each browser the session is different

      res.redirect("/dashboard");
    } else {
      res.render("index", {
        title: "Password Management System",
        msg: "Invalid Username And Password",
      });
    }
  });
});


router.get("/signup", function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser");

  if (req.session.userName) {
    res.redirect("./dashboard");
  } else {
    res.render("signup", { title: "Password Management System", msg: "" });
  }
});

router.post("/signup", checkUsername, checkEmail, function (req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;

  if (password != confpassword) {
    res.render("signup", {
      title: "Password Management System",
      msg: "Password Not Matched",
    });
  } else {
    password = bcrypt.hashSync(password, 10);

    var userDetails = new userModule({
      username: username,
      email: email,
      password: password,
    });
    
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render("signup", {
        title: "Password Management System",
        msg: "User Registered Successfully",
      });
    });
  }
});

router.get("/logout", function (req, res, next) {

  //code to destroy session
  req.session.destroy(function(err) {
    if(err) {
      res.redirect('/')
    }
  })
  localStorage.removeItem("loginToken");
  localStorage.removeItem("loginUser");
  res.redirect("/");
});

module.exports = router;
