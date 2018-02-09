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

module.exports = router;