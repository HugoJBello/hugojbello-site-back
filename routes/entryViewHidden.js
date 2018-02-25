var express = require('express');
var PageEntry   =require('../models/pageEntry');
var router = express.Router();
var logRequest = require("../utils/logRequest");



router.get('/entry_list_hidden/:version',
 function(req, res) {
  var isBlog = (req.params.version=="blog");
  var appId = req.params.version;

  
    PageEntry.find({hidden:true,app_id:appId}).sort({created_at: -1}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        logRequest(req);
        return res.json({error: "No page Found"})
      } else {
        logRequest(req);
        return res.json(entries);
      }
    });
});

router.get('/entry_list_all/:version',
 function(req, res) {
  var isBlog = (req.params.version=="blog");
  var appId = req.params.version
    PageEntry.sort({created_at: -1, app_id:appId}).exec(function(err, entries){
      if (err) throw err;
      if (!entries){
        logRequest(req);
        return res.json({error: "No page Found"})
      } else {
        logRequest(req);
        return res.json(entries);
      }
    });
});

module.exports = router;