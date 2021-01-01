var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var passAPIModule = require("../modules/add_password_model_for_API");
var checkAuthentication=require('./middleware/auth')
var passwordController = require('./controller/password')

//getting data of password stored in database

router.get("/get_all_pass",checkAuthentication, passwordController.get_all_pass);

//adding data(here password) to database via api
router.post("/add_new_pass",checkAuthentication,(req, res, next) => {
  
  var passCategory = req.body.pass_cat; //data get submitted to database via keyname:pass_cat
  var projectName = req.body.project_name;
  var passDetails = req.body.password_details;

  var passDetail = new passAPIModule({
    _id:mongoose.Types.ObjectId(),//hence no need to pass id via postman as other fields
    choose_category: passCategory,
    project_name: projectName,
    password_detail: passDetails,
  });

  //mongoDB Validation to check whether data is sent or leaved blank/duplicated(according to condition specified in Schema) and handling error via api on UI not in terminal

  //return promise and response is handled via then() while exceptions r handled by catch()
  passDetail
    .save()
    .then((doc) => {
      res.status(201).json({
        message: "Password Inserted Successfully",
        result: doc,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

//getPasswordById mthod
router.get("/get_all_pass/:id",checkAuthentication,passwordController.get_all_pass_by_id);

//add(if not exist) or update password data in database
//in put we have to update/pass all the values of a particular row but in patch we can update only neccessary data
router.put("/add_update_pass/:id",checkAuthentication,passwordController.add_update_pass_by_id);

//update password data in database
router.patch("/update_pass",checkAuthentication, passwordController.update_pass_by_id);

//deleting password data from database
router.delete("/delete_pass/:id",checkAuthentication,passwordController.delete_pass_by_id);
module.exports = router;
