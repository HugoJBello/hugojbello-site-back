var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var VisitSchema = new Schema(
  {ip:{type:String},
  url:{type:String},
  date:{type:Date}},
  { collection : 'visits' });

// the schema is useless so far
// we need to create a model using it
var Visit = mongoose.model('visits', VisitSchema);

// make this available to our users in our Node applications
module.exports = Visit;