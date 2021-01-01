var express = require("express");
var router = express.Router();
var userModule = require("../modules/user");
var passCatModule = require("../modules/password_category");
var passModule = require("../modules/add_password");
var jwt = require("jsonwebtoken");

var getAllPass = passModule.find({});

function checkLogin(req, res, next) {
  var loginToken = localStorage.getItem("loginToken"); //getting credential from localstorage
  try {
      var decode = jwt.verify(loginToken, "loginToken"); 
   
  } catch (err) {
    res.redirect("/");
  }
  next(); //passing control to next mthod
}

  if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch"); //creation of new(./scratch folder which stores credentials in hashed form) local storage
  }

  // router.get("/", checkLogin, function (req, res, next) {
//   var loginUser = localStorage.getItem("loginUser");

//   //concept of pagination in nodejs custom code ,we can also perform pagination using mongoDB pagination package
//   var perPage = 3;
//   var page = 1;

//   getAllPass
//     .skip(perPage * page - perPage) //'perPage*page) - perPage' => gives offset value to 'perPage'
//     .limit(perPage)
//     .exec(function (err, data) {
//       if (err) throw err;
//       passModel.countDocuments({}).exec((err, count) => {
//         res.render("viewAllPassword", {
//           title: "Password Management System",
//           loginUser: loginUser,
//           records: data,
//           current: page,
//           pages: Math.ceil(count / perPage), //now add the code for pagination in html file for view_all_password
//         });
//       });
//     });
// });

  //paginatio using plugin(mongoose-paginate)

   //this route is fetched at first time

  router.get("/", checkLogin, function (req, res, next) {
    var loginUser = req.session.userName
  
    //concept of pagination using mongoose-paginate plugin
  
    var options = {
      offset: 1,
      limit: 3,
    };
  
    passModule.paginate({}, options).then(function (result) {
      res.render("viewAllPassword", {
        title: "Password Management System",
        loginUser: loginUser,
        records: result.docs,
        current: result.offset,
        pages: Math.ceil(result.total / result.limit), //now add the code for pagination in html file for view_all_password
      });
    });
  });
  
   //concept of pagination in nodejs custom code
  
  router.get("/:page", checkLogin, function (req, res, next) {
    var loginUser = req.session.userName
    var perPage = 3;
    var page = req.params.page || 1;
  
    getAllPass
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function (err, data) {
        if (err) throw err;
        passModule.countDocuments({}).exec((err, count) => {
          if (err) throw err;
          res.render("viewAllPassword", {
            title: "Password Management System",
            loginUser: loginUser,
            records: data,
            current: page,
            pages: Math.ceil(count / perPage), //now add the code for pagination in html file for view_all_password
          });
        });
      });
  });


  module.exports = router;