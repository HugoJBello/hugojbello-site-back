var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var CountSchema = new Schema(
  {ip:{type:String},
  date:{type:Date}},
  { collection : 'counts' });

// the schema is useless so far
// we need to create a model using it
var Count = mongoose.model('counts', CountSchema);

// make this available to our users in our Node applications
module.exports = Count;