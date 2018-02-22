var express = require('express');
var PageEntry = require('../models/pageEntry');
var PageEntryHistory = require('../models/pageEntryHistory');

var md = require("marked");
var router = express.Router();
var Category = require('../models/category');
var categoryUtils = require("../utils/categoryUtils");
var rename = require("../utils/renameUtils");


router.post('/entry_editor', function (req, res) {
  var categories = req.body.categories;
  var hidden = req.body.hidden;
  var name = req.body.name;
  var blog_version =req.body.blog_version;
  var appId = req.body.app_id;
  if (name) {
  if (req.body.categoriesSemicolom) categories = req.body.categoriesSemicolom.split(';');
   
  var entry = new PageEntry({
    '_id': req.body._id,
    'name': req.body.name,
    'title': req.body.title,
    'content': req.body.content,
    'blog_version':blog_version,
    'updated_at': new Date(),
    'app_id': appId,
    'categories': categories,
    'hidden': hidden
  });
  var entryHistory = new PageEntryHistory({
    'name': req.body.name,
    'title': req.body.title,
    'content': req.body.content,
    'blog_version':blog_version,
    'updated_at': new Date(),
    'app_id': appId,
    'categories': categories,
    'hidden': hidden
  });

  if (req.body.new == 'true') {
    PageEntry.findOne({ name: name ,app_id:appId}, function (err, existingEntry) {
      if (!existingEntry) {
        entry.created_at = new Date();
        entryHistory.created_at = new Date();
        PageEntry.create(entry, function (err, raw) {
          if (err) throw err;
          console.log("page created");
          return res.json({ result: "entry added" });
        });
        try {
          PageEntryHistory.create(entryHistory, function (err, raw) {
            if (err) throw err;
            updateCategories(hidden,categories,appId);
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        return res.json({ result: "entry already exists and can not be created again" });
      }
    });
  } else {
    PageEntry.findByIdAndUpdate(req.body._id, entry, function (err, raw) {
      if (err) throw err;
      entryHistory.title = entry.title;
      PageEntryHistory.create(entryHistory, function (err, raw) {
        if (err) throw err;
        console.log("page created");
        updateCategories(hidden,categories,appId)
      });

      return res.json({ result: "entry added" });
      updateCategories(hidden,categories,appId)
    });
  }
  
  } else {
    return res.json({ result: "entry without name" });

  }
});

function updateCategories(hidden,categories,appId){
  if (!hidden && categories) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i]) categoryUtils.updateCategory(categories[i],appId);
    }
  }
}
module.exports = router;