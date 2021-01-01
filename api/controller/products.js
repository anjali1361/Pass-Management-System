var productModule = require("../../modules/product");
const mongoose = require("mongoose");

exports.get_all_products = (req, res, next) => {
  productModule
    .find()
    .select("product_name price quantity image")
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Success",
        results: data,
      });
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.add_new_product = (req, res, next) => {
  //productImage var name is used while sending data via postman,upload.single() is a middleware

  console.log(req.file);

  //console.log(req.file) body is replaced with file in case of file upload
  var productName = req.body.name; //data get submitted to database via keyname:pass_cat
  var price = req.body.price;
  var quantity = req.body.quantity;

  //for saving all info to mongodb
  var productDetails = new productModule({
    _id: mongoose.Types.ObjectId(), //hence no need to pass id via postman as other fields
    product_name: productName,
    price: price,
    quantity: quantity,
    image: req.file.path,
  });

  productDetails
    .save()
    .then((doc) => {
      res.status(201).json({
        message: "Product Inserted Successfully",
        result: doc,
      });
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.get_all_product_by_id = (req, res, next) => {
  var id = req.params.id;

  //another way of fetching few fiels's in all data
  productModule
    .findById(id)
    .select("product_name price quantity image")
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
};

exports.add_update_product_by_id = (req, res, next) => {

  var id = req.params.id;
  var productName = req.body.name;
  var price = req.body.price;
  var quantity = req.body.quantity;
  var image = req.file.path;

  productModule.findById(id, (err, data) => {
    if (err) throw err;
    data.product_name = productName ? productName : data.product_name;

    data.price = price ? price : data.price;

    data.quantity = quantity ? quantity : data.quantity;

    data.image = image ? image : data.image;

    data
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "Product Updated Successfully",
          result: doc,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  });
};

exports.update_product_by_id = (req, res, next) => {
  //passing id via body(bodey->raw in postman)
  var id = req.body._id;
  var productName = req.body.name;
  var price = req.body.price;
  var quantity = req.body.quantity;
  var image = req.file.path;

  productModule.findById(id, (err, data) => {
    if (err) throw err;
    data.product_name = productName ? productName : data.product_name;

    data.price = price ? price : data.price;

    data.quantity = quantity ? quantity : data.quantity;

    data.image = image ? image : data.image;

    data
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "Product  Updated Successfully",
          result: doc,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  });
};

exports.delete_product_by_id = (req, res, next) => {
  var id = req.params.id;
  productModule
    .findByIdAndDelete(id)
    .then((doc) => {
      res.status(201).json({
        message: "Product Deleted Successfully",
        result: doc, //gives null if data is deleted already
      });
    })
    .catch((err) => {
      res.json(err);
    });
};
