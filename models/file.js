var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var FileSchema = new Schema(
  {filename:{ type: String, required: true},
  base64:String,
  created_at: Date},
  { collection : 'Files' });

// the schema is useless so far
// we need to create a model using it
var File = mongoose.model('File', FileSchema);

// make this available to our users in our Node applications
module.exports = File;