var express = require('express');
var Category = require('../models/category');
var PageEntry = require('../models/pageEntry');
var md = require("marked");
var router = express.Router();
var logRequest = require("../utils/logRequest");


router.get('/category_list/:version/',
  //isAuthenticated,
  function (req, res) {
    var isBlog = (req.params.version==="blog");
    var appId = req.params.version;
      Category.find({app_id:appId}).sort({updated_at: -1}).exec(function (err, categories) {
        if (err) throw err;
        if (!categories) {
          logRequest(req);
          return res.json({ error: "No page Found" })
        } else {
          // countMembers(categories, function(result){
          //   res.json(result)
          // });
          logRequest(req);
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
          logRequest(req);
          return res.json({ error: "No page Found" })
        } else {
          logRequest(req);
          res.json(entries);
        }
      });  
  });

module.exports = router;