//  OpenShift sample Node application
var express = require('express'),
  app = express(),
  morgan = require('morgan');

var mongoose = require('mongoose');
var pageCounter = require('./routes/pageCounter');
var entryView = require('./routes/entryView');
var entryEditor = require('./routes/entryEditor');
var files = require('./routes/files');
var images = require('./routes/images');
var categoryView = require('./routes/categoryView');
var checkJwt = require('./auth/checkJwt');
var config = require('./config/config');

const cors = require('cors');
app.use(cors());

//var pageCounter = require('./routes/pageCounter');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

Object.assign = require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";

if (mongoURL == null) {

  var mongoHost = process.env['MONGODB_HOST_MLAB'],
    mongoPort = process.env['MONGODB_PORT_MLAB'],
    mongoDatabase = process.env['MONGODB_DATABASE_MLAB'],
    mongoPassword = process.env['MONGODB_PASSWORD_MLAB'],
    mongoUser = process.env['MONGODB_USER_MLAB'];

  if (process.env.NODE_ENV !== 'production') {
    var mongoHost = process.env.MONGODB_HOST_MLAB; 
    var mongoPort = process.env.MONGODB_PORT_MLAB;
    var mongoDatabase = process.env.MONGODB_DATABASE_MLAB;
    var mongoPassword = process.env.MONGODB_PASSWORD_MLAB;
    var mongoUser = process.env.MONGODB_USER_MLAB;
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    console.log(mongoURL);

  }
}

mongoose.connect(mongoURL);
if (config.useAuth0){
  console.log("Using  auth0 for endpoins /editor/* and /files/*");
  app.use('/editor/',checkJwt);
  app.use('/files/',checkJwt);
} else {
  console.log("not using auth0");
}

app.use("/", pageCounter);
app.use("/entries", entryView);
app.use("/editor", entryEditor);
app.use("/files", files);
app.use("/images", images);
app.use("/categories", categoryView);



app.get('/pagecount', function (req, res) {
  res.json({ pagecount: -1 })
  //res.send('{ pageCount: -1 }');
});

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;  
