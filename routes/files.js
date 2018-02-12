var express = require('express');
var File   =require('../models/file');
var md = require("marked");
var router = express.Router();
var renameUtils = require('../utils/renameUtils')


router.post('/upload',
 //isAuthenticated,
 function(req, res) {
   if(req.body){
    file = new File({'filename':req.body.filename , 'base64':req.body.base64, 'created_at': new Date()});
    File.create(file, function(err){
      if (err) {
        res.json({result:"error"});
        throw err;
      }
        return res.json({result:"file uploaded successfully"});    
    });
   }
  
});

router.get('/image/:filename',
 function(req, res) {
    File.find({'filename': req.params.filename}, function(err, file){
      if (err) throw err;
      if (!file){
        return res.json({error: "No page Found"})
      } else {
        if(file[0].base64){
          if (file[0].base64.includes(",")) file[0].base64=file[0].base64.split(",")[1];
          console.log(file[0].base64);
          var bitmap = new Buffer(file[0].base64.replace("base64,",""), 'base64');
          res.contentType('image/jpeg');
          res.end(bitmap, "binary");
          //return res.json(file);
        }
        
      }
    });
});


module.exports = router;