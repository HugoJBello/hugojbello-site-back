var express = require('express');
var router = express.Router();
var connection = require("../database/connection");
var con = connection();
var initDb = con.initDb;
var db = con.db;
console.log(con);


router.get('/', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
      initDb(function (err) { });
    }
    if (db) {
      var col = db.collection('counts');
      // Create a document with request IP and current time of request
      col.insert({ ip: req.ip, date: Date.now() });
      col.count(function (err, count) {
        if (err) {
          console.log('Error running count. Message:\n' + err);
        }
        res.render('index.html', { pageCountMessage: count, dbInfo: dbDetails });
      });
    } else {
      res.render('index.html', { pageCountMessage: null });
    }
  });
  
  router.get('/pagecount', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
      initDb(function (err) { });
    }
    if (db) {
      db.collection('counts').count(function (err, count) {
        var result = { pageCount: count };
        res.json(result);
        //res.send('{ pageCount: ' + count + '}');
      });
    } else {
      res.json({ pagecount: -1 })
      //res.send('{ pageCount: -1 }');
    }
  });

  module.exports = router;