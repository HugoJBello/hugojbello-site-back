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
  if (name) {
  console.log(hidden);
  if (req.body.categoriesSemicolom) categories = req.body.categoriesSemicolom.split(';');
  if (!hidden && categories) {
    for (var i = 0; i < categories.length; i++) {
      console.log(rename.cleanCategoryName(categories[i]));
      if (categories[i]) categoryUtils.updateCategory(rename.cleanCategoryName(categories[i]));
    }
  }


  var entry = new PageEntry({
    '_id': req.body._id,
    'name': req.body.name,
    'title': req.body.title,
    'content': req.body.content,
    'updated_at': new Date(),
    'categories': categories,
    'hidden': hidden
  });
  var entryHistory = new PageEntryHistory({
    'name': req.body.name,
    'title': req.body.title,
    'content': req.body.content,
    'updated_at': new Date(),
    'categories': categories,
    'hidden': hidden
  });
  console.log(entry);

  if (req.body.new == 'true') {
    PageEntry.findOne({ name: name }, function (err, existingEntry) {
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
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        return res.json({ result: "entry already exists and can not be created again" });
      }
    });
  } else {
    console.log("::::::")
    PageEntry.findByIdAndUpdate(req.body._id, entry, function (err, raw) {
      if (err) throw err;
      entryHistory.title = entry.title;
      console.log("----");
      PageEntryHistory.create(entryHistory, function (err, raw) {
        if (err) throw err;
        console.log("page created");
      });

      return res.json({ result: "entry added" });
    });
  }
  
  } else {
    return res.json({ result: "entry without name" });

  }
});


module.exports = router;