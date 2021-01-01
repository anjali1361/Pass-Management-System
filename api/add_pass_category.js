//we can not pass html layout via api,only we can send or receive raw data

var express = require("express");
var router = express.Router();
var passCatModule = require("../modules/password_category");
var categoryControllers = require('./controller/category')
var checkAuthentication=require('./middleware/auth')//to verify authentication via middleware created

var getPassCat = passCatModule.find({});

//getting some out af all data
var getPassCat = passCatModule.find({ _id: "5f71ff0bc906830cc0da6042" });

//getting few fields of a row out of all
var getPassCat = passCatModule.find({}, { password_category: 1 });

//getting data of password category stored in database

router.get("/get_category",checkAuthentication, categoryControllers.get_category);

//adding data(here pass category) to database via api
router.post("/add_category",checkAuthentication, categoryControllers.add_category);

//add(if not exist) or update pass category data in database
//in put we have to update/pass all the values of a particular row but in patch we can update only neccessary data
router.put("/add_update_category/:id",checkAuthentication, categoryControllers.add_update_category_by_id);

//update pass category data in database
router.patch("/update_category",checkAuthentication, categoryControllers.update_category_by_id);

//deleting pass category data from database
router.delete("/delete_category/:id",checkAuthentication, categoryControllers.delete_category_by_id);
module.exports = router;
