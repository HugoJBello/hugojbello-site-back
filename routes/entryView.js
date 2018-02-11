var express = require('express');
var PageEntry   =require('../models/pageEntry');
var md = require("marked");
var router = express.Router();
var renameUtils = require('../utils/renameUtils')


router.get('/entry_view/:entry_name',
 //isAuthenticated,
 function(req, res) {
    PageEntry.findOne({'name':req.params.entry_name}, function(err, entry){
      if (err) throw err;
      if (!entry){
        return res.json({error: "No page Found"})
      } else {
        var referencedContents =  manageInternarReferences(entry.content);
         var contentHtml = md(referencedContents);
        return res.json({entry :  entry,contentHtml : contentHtml});
      }
    });
});

router.get('/entry_list',
 function(req, res) {
    PageEntry.find({}, function(err, entries){
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
  var links = mdEntry.match(/\[(.*?)\]\((.*?)\)/g);
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