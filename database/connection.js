var mongodb = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
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

var connection = {db: null, initdb:()=>{}};

var db = null,
  dbDetails = new Object();

var initDb = function (callback) {
  if (mongoURL == null) return;

  if (mongodb == null) return;

  mongodb.connect(mongoURL, function (err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
    
  });
};

connection.db = db;
connection.initDb = initDb;

initDb(function (err) {
  console.log('Error connecting to Mongo. Message:\n' + err);
});
module.exports = connection;
