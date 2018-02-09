var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var schema = new Schema(
  { name:{ type: String, required: true, unique: true },
  title:String,
  created_at: Date,
  updated_at: Date,
  author: String,
  content:String,
  categories: [String],
  edited_by:String},
  { collection : 'PageEntries' });

var PageEntry = mongoose.model('PageEntry', schema);

module.exports =  PageEntry;