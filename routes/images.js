var express = require('express');
var File   =require('../models/file');
var router = express.Router();
var logRequest = require("../utils/logRequest");
var perPage = 10;

router.get('/image/:filename',
 function(req, res) {
    File.find({'filename': req.params.filename}, function(err, file){
      if (err) throw err;
      if (!file){
        logRequest(req);
        return res.json({error: "No page Found"})
      } else {
        if(file[0].base64){
          if (file[0].base64.includes(",")) file[0].base64=file[0].base64.split(",")[1];
          var bitmap = new Buffer(file[0].base64.replace("base64,",""), 'base64');
          logRequest(req);
          res.contentType('image/jpeg');
          res.end(bitmap, "binary");
          //return res.json(file);
        }
        
      }
    });
});

router.get('/images_list_page/:page/:perPage',
 function(req, res) {
   perPage=req.params.perPage;
    numberOfPages(function(pages, totalItems,perPage){
      findFiles(req.params.page, function(fileList){
        res.json({files:fileList, pages:pages, totalItems:totalItems});
        });
    });
});

function numberOfPages (callback,perPage){
  File.count({}, function( err, count){
    var pages = Math.floor(count/perPage)+1;
    var totalItems = count; 
    return callback(pages, totalItems);
  });
}

function findFiles (page, callback,perPage){
  page = page-1;

  File.find({})
  .limit(perPage)
  .skip(perPage * page)
  .sort({created_at:-1})
  .select('filename created_at')
  .exec(function(err, fileList){
    if (err) throw err;
    console.error("error retrieving list of files");
    return callback(fileList);
  });
}


module.exports = router;