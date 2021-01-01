const mongoose = require("mongoose");
// const { schema } = require("./user");
//requiring plugin
var mongoosePaginate = require('mongoose-paginate'); 
mongoose.connect("mongodb://localhost:27017/pms", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var conn = mongoose.Collection;

var productSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image:{type:String,required:true},
  date: {
    type: Date,
    default: Date.now,
  },
});
productSchema.plugin(mongoosePaginate);
var productModel = mongoose.model("Products", productSchema);
module.exports = productModel;