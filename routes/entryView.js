var express = require('express');
var PageEntry   =require('../models/pageEntry');
var md = require("marked");
var router = express.Router();
var renameUtils = require('../utils/renameUtils')
var categoryUtils = require ("../utils/categoryUtils");


router.get('/entry_view/:entry_name',
 //isAuthenticated,
 function(req, res) {
    PageEntry.findOne({'name':req.params.entry_name}, function(err, entry){
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

router.get('/entry_remove/:entry_name',
 //isAuthenticated,
 function(req, res) {
    PageEntry.findOne({'name':req.params.entry_name}, function(err, entry){
      var categories = entry.categories;
      for (var i = 0; i < categories.length; i++) {
        if (categories[i]) categoryUtils.updateCategory(categories[i]);
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
   if (req.param.version=="blog"){
    PageEntry.find({hidden:false,blog_version:true}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
   } else {
    PageEntry.find({hidden:false,blog_version:false}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
   }
    
});

router.get('/entry_list_hidden/:version',
 function(req, res) {
  if (req.param.version=="blog"){
    PageEntry.find({hidden:true,blog_version:true}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
  } else {
    PageEntry.find({hidden:true,blog_version:false}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
  }
});

router.get('/entry_list_all/:version',
 function(req, res) {
  if (req.param.version=="blog"){
    PageEntry.sort({created_at: -1, blog_version:true}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
  } else {
    PageEntry.sort({created_at: -1, blog_version:false}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        return res.json({error: "No page Found"})
      } else {
        return res.json(entries);
      }
    });
  }
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