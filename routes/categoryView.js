var express = require('express');
var Category = require('../models/category');
var PageEntry = require('../models/pageEntry');
var md = require("marked");
var router = express.Router();


router.get('/category_list/:version/',
  //isAuthenticated,
  function (req, res) {
    var isBlog = (req.params.version==="blog");
    var appId = req.params.version;
      Category.find({app_id:appId}).sort({updated_at: -1}).exec(function (err, categories) {
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

  router.get('/entries_in_category/:version/:name',
  //isAuthenticated,
  function (req, res) {
    var isBlog = (req.params.version==="blog");
    var appId = req.params.version;
      PageEntry.find({hidden:false,'categories':req.params.name, app_id:appId}).sort({created_at: -1}).exec( function (err, entries) {
        if (err) throw err;
        if (!entries) {
          return res.json({ error: "No page Found" })
        } else {
          res.json(entries);
        }
      });  
  });

module.exports = router;