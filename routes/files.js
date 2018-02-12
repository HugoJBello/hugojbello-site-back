var express = require('express');
var File   =require('../models/file');
var md = require("marked");
var router = express.Router();
var renameUtils = require('../utils/renameUtils')


router.post('/upload',
 //isAuthenticated,
 function(req, res) {
   file = new File({'filename':req.body.filename , 'base64':req.body.base64, 'created_at': new Date()});
    File.create(file, function(err){
      if (err) throw err;
        return res.json({result:"file uploaded successfully"});    
    });
});

router.get('/image/:filename',
 function(req, res) {
    File.find({'filename': req.params.filename}, function(err, file){
      if (err) throw err;
      if (!file){
        return res.json({error: "No page Found"})
      } else {
        console.log(file);
        var bitmap = new Buffer(file[0].base64, 'base64');
        res.contentType('image/jpeg');
        res.end(bitmap, "binary");
        //return res.json(file);
      }
    });
});


module.exports = router;