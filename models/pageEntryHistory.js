var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var schema = new Schema(
  { name:{ type: String, required: true},
  title:String,
  created_at: Date,
  updated_at: Date,
  author: String,
  content:String,
  app_id:String,
  categories: [String],
  edited_by:String,
  version:Number},
  { collection : 'PageEntriesHistory' });

var PageEntryHistory = mongoose.model('PageEntryHistory', schema);

module.exports =  PageEntryHistory;