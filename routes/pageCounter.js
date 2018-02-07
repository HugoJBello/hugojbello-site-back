var express = require('express');
var router = express.Router();
var db = require("../database/db");
var Count = require("../models/count");

router.get('/', function (req, res) {
  var entry = new Count ({ ip: req.ip, date: Date.now()});
  entry.save((err) => {
    if (err) throw err;
    Count.count({}, (err, count) => {
      if (err) throw err;
      res.render('index2.html', { pageCountMessage: count, dbInfo: undefined });
    });
  });
});

module.exports = router;