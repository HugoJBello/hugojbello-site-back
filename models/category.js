var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var CathegorySchema = new Schema(
  {name:{ type: String, required: true },
  description: String,
  number_of_entries: String,
  created_at: Date,
  updated_at: Date,
  blog_version:Boolean}, 
  { collection : 'Categories' });

// the schema is useless so far
// we need to create a model using it
var Cathegory = mongoose.model('Category', CathegorySchema);

// make this available to our users in our Node applications
module.exports = Cathegory;