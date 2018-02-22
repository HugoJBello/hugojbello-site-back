var express = require('express');
var Category = require('../models/category');
var PageEntry = require('../models/pageEntry');
var md = require("marked");
var router = express.Router();


router.get('/category_list/:version/',
  //isAuthenticated,
  function (req, res) {
    if (req.params.version){
      Category.find({}).sort({updated_at: -1, blog_version:req.param.version}).exec(function (err, categories) {
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
    } else {
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
    }
    
  });

  router.get('/entries_in_category/:version/:name',
  //isAuthenticated,
  function (req, res) {
    if (req.params.version=="blog"){
      PageEntry.find({hidden:false,'categories':req.params.name, blog_version:true}).sort({created_at: -1}).exec( function (err, entries) {
        if (err) throw err;
        if (!entries) {
          return res.json({ error: "No page Found" })
        } else {
          res.json(entries);
        }
      });
    } else {
      PageEntry.find({hidden:false,'categories':req.params.name, blog_version:false}).sort({created_at: -1}).exec( function (err, entries) {
        if (err) throw err;
        if (!entries) {
          return res.json({ error: "No page Found" })
        } else {
          res.json(entries);
        }
      });
    }
    
  });

function countMembers(categories, callback) {
  var result = [];
  for (var category of categories) {
    PageEntry.count({ categories: category.name, blog_version:category.blog_version}, function (err, count) {
      var entry = { category: categories, count: count };
      console.log(entry);
      result.push(entry);
    });
  }
  callback(result);
}

module.exports = router;