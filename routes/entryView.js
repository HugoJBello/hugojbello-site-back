var express = require('express');
var PageEntry   =require('../models/pageEntry');
var md = require("marked");
var router = express.Router();
var renameUtils = require('../utils/renameUtils')
var categoryUtils = require ("../utils/categoryUtils");


router.get('/entry_view/:version/:entry_name',
 //isAuthenticated,
 function(req, res) {
    var isBlog = (req.param.version=="blog");
    PageEntry.findOne({'name':req.params.entry_name, blog_version:isBlog}, function(err, entry){
      if (err) throw err;
      if (!entry){
        return res.json({error: "No page Found"})
      } else {
        if(entry.content){
          var referencedContents =  manageInternarReferences(entry.content);
          var contentHtml = md(referencedContents);
        }
        return res.json({entry :  entry,contentHtml : contentHtml});
      }
    });
});

router.get('/entry_remove/:version/:entry_name',
 //isAuthenticated,
 function(req, res) 
 {
   var isBlog = (req.param.version=="blog");
   var app_id = req.params.version;
    PageEntry.findOne({'name':req.params.entry_name,blog_version:isBlog}, function(err, entry){
      var categories = entry.categories;
      for (var i = 0; i < categories.length; i++) {
        if (categories[i]) categoryUtils.updateCategory(categories[i],isBlog);
      }
      if (err) throw err;
      if (!entry){
        return res.json({result: "No page Found"})
      } else {
        PageEntry.deleteOne(entry,function(err){
          if (err) {
            throw err;
            return res.json({result: "error deleting"})
          } else {
            return res.json({result: "page deleted"})
          }
        });
      }
    });
});

router.get('/entry_list/:version',
 function(req, res) {
  var isBlog = (req.param.version=="blog");
  var appId = req.param.version;

    PageEntry.find({hidden:false,blog_version:isBlog}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    }); 
});

router.get('/entry_list_hidden/:version',
 function(req, res) {
  var isBlog = (req.param.version=="blog");
  var app_id = req.params.version;

  
    PageEntry.find({hidden:true,blog_version:isBlog}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
});

router.get('/entry_list_all/:version',
 function(req, res) {
  var isBlog = (req.param.version=="blog");

    PageEntry.sort({created_at: -1, blog_version:isBlog}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
});

function manageInternarReferences(mdEntry){
  regex= '/\[(.+?)\]/g';
  var links;
  if(mdEntry) links = mdEntry.match(/\[(.*?)\]\((.*?)\)/g);
  if (links){
    for (var i=0; i< links.length; i++){
      if (!((links[i].includes('http:'))|| (links[i].includes('https:')))){
        var insideParenthesis = extractFronParenthesis(links[i]);
        var cleanLink = links[i].replace('('+insideParenthesis+')','('+ titleToFilename(insideParenthesis)+')');
      //  var replacedText = new RegExp(links[i], 'g');
        mdEntry=mdEntry.replace(links[i], cleanLink);
      }
    }
  }
  return mdEntry;
}

function titleToFilename(title){
var name = '';
name=title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
return name;
}


function extractFronParenthesis(str){
  var regex= '/\((.+?)\)/g';
  var extracted='';
  if(str.match(/\((.+?)\)/g)) {
    extracted = str.match(/\((.+?)\)/g).pop().replace('(','').replace(')','');
  }
  return extracted;
}

module.exports = router;