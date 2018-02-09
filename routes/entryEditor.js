var express = require('express');
var PageEntry   =require('../models/pageEntry');
var PageEntryHistory   =require('../models/pageEntryHistory');

var md = require("marked");
var router = express.Router();
var Category = require('../models/category');



router.post('/entry_editor', function(req, res) {
  var categories = req.body.categoriesSemicolom.split(';');
  for (var i=0; i<categories.length;i++){
    if (categories[i]) updateCategory(categories[i]);
  }

  var entry = new PageEntry({//'_id': req.body._id,
                            'name':req.body.entry_name,
                            'title':req.body.title,
                            'content':req.body.content,
                            'updated_at': new Date(),
                            'categories':categories});
  var entryHistory = new PageEntryHistory({'name':req.body.entry_name,
                                          'title':req.body.title,
                                          'content':req.body.content,
                                          'updated_at': new Date(),
                                          'categories':categories});
  console.log(entry);
                                       
  if (req.body.new =='true'){
    entry.created_at = new Date();
    entryHistory.created_at = new Date();
    PageEntry.create(entry, function(err,raw){
      if (err) throw err;
      return res.json({result:"entry added"});
    });
    PageEntryHistory.create(entryHistory, function(err,raw){
      if (err) throw err;
    });
  } else  {
    PageEntry.findByIdAndUpdate(req.body._id, entry, function(err,raw){
      if (err) throw err;
      entryHistory.title=entry.title;
      PageEntryHistory.create(entryHistory, function(err,raw){
        if (err) throw err;
      });
      return res.json({result:"entry added"});
    });
  }
});

function updateCategory (category_name){
  Category.findOne({'name':category_name}, function(err, category){
    if (err) throw err;
    if(!category){
      var category_new = new Category({'name':category_name,
                                          'created_at': new Date()});
      Category.create(category_new, function(err,raw){
        if (err) throw err;
        });
    } else {
      countEntriesWithCategory (category_name, function(count){
        category.number_of_entries = count;
        category.updated_at= new Date();
        Category.update({'_id':category._id}, category, function(err,raw){
          if (err) throw err;
        });
      });
    }
  });
}

function countEntriesWithCategory (category_name, callback){
  PageEntry.count({'categories':category_name})
  .exec(function(err, count){
    if (err) throw err;
    return callback(count);
  });
}

module.exports = router;