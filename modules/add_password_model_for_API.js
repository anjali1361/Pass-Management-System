const mongoose = require("mongoose");
//requiring plugin
var mongoosePaginate = require('mongoose-paginate'); 
mongoose.connect("mongodb://localhost:27017/pms", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var conn = mongoose.Collection;

var passAPISchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  //changing type from String to this in choose_category field to use populate() mthod of mongoose to join the data from two tables(also done by using lookup aggregate mthod)
  choose_category: { type:mongoose.Schema.Types.ObjectId,ref:'password_categories', required: true },
  project_name: { type: String, required: true },
  password_detail: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});
passAPISchema.plugin(mongoosePaginate);
var passAPIModel = mongoose.model("password_details_API", passAPISchema);
module.exports = passAPIModel;