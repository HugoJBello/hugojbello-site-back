var express = require('express');
var router = express.Router();
var db = require("../database/db");
var Count = require("../models/count");

router.get('/count_pages', function (req, res) {
  var entry = new Count ({ ip: req.ip, date: Date.now()});
  entry.save((err) => {
    if (err) throw err;
    Count.count({}, (err, count) => {
      if (err) throw err;
      res.render('index.html', { pageCountMessage: count, dbInfo: dbDetails });
    });
  });
});

module.exports = router;