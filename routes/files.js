var express = require('express');
var File   =require('../models/file');
var md = require("marked");
var router = express.Router();
var renameUtils = require('../utils/renameUtils')
var logRequest = require("../utils/logRequest");


router.post('/upload',
 //isAuthenticated,
 function(req, res) {
   if(req.body){
    file = new File({'filename':req.body.filename , 'base64':req.body.base64, 'created_at': new Date()});
    File.create(file, function(err){
      if (err) {
        logRequest(req);
        res.json({result:"error"});
        throw err;
      }
        logRequest(req);
        return res.json({result:"file uploaded successfully"});    
    });
   }
  
});

router.get('/images/:limit',
 function(req, res) {
    File.find({}).sort({created_at: -1}).limit(req.param.limit).exec(function(err, files){
      if (err) throw err;
      if (!files){
        logRequest(req);
        return res.json({error: "No page Found"})
      } else {
        logRequest(req);
        return res.json(files);
      }
    });
});

router.get('/file_remove/:file_name',
 //isAuthenticated,
 function(req, res) {
    File.findOne({'filename':req.params.file_name}, function(err, file){
      if (err) throw err;
      if (!file){
        return res.json({result: "No file Found"})
      } else {
        File.deleteOne(file,function(err){
          if (err) {
            throw err;
            logRequest(req);
            return res.json({result: "error deleting"})
          } else {
            logRequest(req);
            return res.json({result: "file deleted"})
          }
        });
      }
    });
});




module.exports = router;