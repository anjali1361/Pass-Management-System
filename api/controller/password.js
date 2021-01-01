var passAPIModule = require("../../modules/add_password_model_for_API");
exports.get_all_pass = (req, res, next) => {

  //another way of fetching few fiels's in all data
  passAPIModule
    .find()
    .select("_id choose_category project_name password_detail")
    .populate("choose_category", "password_category")
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "success",
        results: data,
      });
    })
    .catch((err) => {
      res.json(err);
    });
}

//exports.add_new_pass= 
exports.get_all_pass_by_id = (req, res, next) => {

  var id = req.params.id;

  //another way of fetching few fiels's in all data
    passAPIModule
      .findById(id)
      .select("_id choose_category project_name password_detail")
      .populate("choose_category","password_category")
      .exec()
      .then((data) => {
        res.status(200).json({
          message: "success",
          results: data,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }
  exports.add_update_pass_by_id = (req, res, next) => {
    var id = req.params.id;
    var passCategory = req.body.pass_cat;
    var projectName = req.body.project_name;
    var passDetails = req.body.password_details;
  
    passAPIModule.findById(id, (err, data) => {
      if (err) throw err;
      data.choose_category = passCategory ? passCategory : data.choose_category;
  
      data.project_name = projectName ? projectName : data.project_name;
  
      data.password_detail = passDetails ? passDetails : data.password_detail;
  
      data
        .save()
        .then((doc) => {
          res.status(201).json({
            message: "Password Updated Successfully",
            result: doc,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }

  exports.update_pass_by_id=(req, res, next) => {
    //passing id via body(bodey->raw in postman)
    var id = req.body._id;
    var passCategory = req.body.pass_cat;
    var projectName = req.body.project_name;
    var passDetails = req.body.password_details;
  
    passAPIModule.findById(id, (err, data) => {
      if (err) throw err;
      data.choose_category = passCategory ? passCategory : data.choose_category;
  
      data.project_name = projectName ? projectName : data.project_name;
  
      data.password_detail = passDetails ? passDetails : data.password_detail;
  
      data
        .save()
        .then((doc) => {
          res.status(201).json({
            message: "Password Updated Successfully",
            result: doc,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }

  exports.delete_pass_by_id= (req, res, next) => {
    var id = req.params.id;
    passAPIModule
      .findByIdAndDelete(id)
      .then((doc) => {
        res.status(201).json({
          message: "Password Deleted Successfully",
          result: doc, //gives null if data is deleted already
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }

  