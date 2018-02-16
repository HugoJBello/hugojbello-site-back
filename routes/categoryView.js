var express = require('express');
var Category = require('../models/category');
var PageEntry = require('../models/pageEntry');
var md = require("marked");
var router = express.Router();


router.get('/category_list',
  //isAuthenticated,
  function (req, res) {
    Category.find({}).sort({updated_at: -1}).exec(function (err, categories) {
      if (err) throw err;
      if (!categories) {
        return res.json({ error: "No page Found" })
      } else {
        // countMembers(categories, function(result){
        //   res.json(result)
        // });
        res.json(categories);
      }
    });
  });

  router.get('/entries_in_category/:name',
  //isAuthenticated,
  function (req, res) {
    console.log(req.params.name);
    PageEntry.find({hidden:false,'categories':req.params.name}).sort({created_at: -1}).exec( function (err, entries) {
      if (err) throw err;
      if (!entries) {
        return res.json({ error: "No page Found" })
      } else {
        res.json(entries);
      }
    });
  });

function countMembers(categories, callback) {
  var result = [];
  for (var category of categories) {
    PageEntry.count({ categories: category.name }, function (err, count) {
      var entry = { category: categories, count: count };
      console.log(entry);
      result.push(entry);
    });
  }
  callback(result);
}

module.exports = router;