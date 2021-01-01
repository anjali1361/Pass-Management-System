var passCatModule = require("../../modules/password_category");
var getPassCat = passCatModule.find({});
exports.get_category= (req, res, next) => {
    /*
  getPassCat.exec(function (err, data) {
    if (err) throw err;

    res.status(200).json({
      message: "success",
      results: data,
    });
  });
  */
 getPassCat.exec()
 .then(data=>{
    res.status(200).json({
        message: "success",
        results: data

 })
})
 .catch(err=>{
     res.json(err)
 })

}

exports.add_category = (req, res, next) => {
    console.log(req.userData);
    var passCategory = req.body.pass_cat; //data get submitted to database via keyname:pass_cat
    var passCatDetail = new passCatModule({ password_category: passCategory });
  
    //mongoDB Validation to check whether data is sent or leaved blank/duplicated(according to condition specified in Schema) and handling error via api on UI not in terminal
  
    //return promise and response is handled via then() while exceptions r handled by catch()
    passCatDetail
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "Category Inserted Successfully",
          result: doc,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }

  exports.add_update_category_by_id = (req, res, next) => {
    var id = req.params.id;
    var passCategory = req.body.pass_cat;
  
    passCatModule.findById(id, (err, data) => {
      if (err) throw err;
      data.password_category = passCategory
        ? passCategory
        : data.password_category;
    
      data
        .save()
        .then((doc) => {
          res.status(201).json({
            message: "Category Updated Successfully",
            result: doc,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }

  exports.update_category_by_id =(req, res, next) => {
    //passing id via body(bodey->raw in postman)
    var id = req.body._id;
    var passCategory = req.body.pass_cat;
  
    passCatModule.findById(id, (err, data) => {
      if (err) throw err;
      data.password_category = passCategory
        ? passCategory
        : data.password_category;
      data
        .save()
        .then((doc) => {
          res.status(201).json({
            message: "Category Updated Successfully",
            result: doc,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    });
  }

  exports.delete_category_by_id =(req, res, next) => {
    var id = req.params.id;
    passCatModule
      .findByIdAndDelete(id)
      .then((doc) => {
        res.status(201).json({
          message: "Category Deleted Successfully",
          result: doc,//gives null if data is deleted already
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }