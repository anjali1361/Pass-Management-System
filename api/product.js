var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
var productControllers = require('./controller/products')
//multer converts automatically the data to json format hence remove it from headers part i.e. generated autmaically in postman
var multer = require('multer')
var checkAuthentication=require('./middleware/auth')
//var checkAuthentication=require('./middleware/auth')

//until we not declare storage for storing files to disk with all descriptions below
//image path
//we can not able to view image inserted in uploads folder as the extension is not added to it

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});


//giving destination folder for file upload under multer() function, uploads folder will be generated automatcally

//var upload = multer({ dest: 'uploads/' })

//applying filter

const fileFilter=(req, file, cb)=>{

    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }

}

//applying filter and limits in file upload

var upload = multer({
    storage: storage,
    limits: {
        fileSize : 1024 * 1024 * 5//5MB
    },
    fileFilter: fileFilter

});


router.get("/get_all_product",checkAuthentication,productControllers.get_all_products );

router.post("/add_new_product", upload.single('productImage'),checkAuthentication, productControllers.add_new_product);

//getProductById mthod
router.get("/get_all_product/:id",checkAuthentication, productControllers.get_all_product_by_id)

router.put("/add_update_product/:id",upload.single('productImage'),checkAuthentication, productControllers.add_update_product_by_id);

//update password data in database
router.patch("/update_product",upload.single('productImage'),checkAuthentication, productControllers.update_product_by_id);

router.delete("/delete_product/:id",checkAuthentication,  productControllers.delete_product_by_id);

module.exports = router;
