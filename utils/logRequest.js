
var Visit = require('../models/visit');

logRequest = (req) => {
  try{
    var userIp = req.ip;
    var userUrl = req.url;
  } catch (err) {
    var userIp = "unknown IP";
    var userUrl = "unknown id";
  }
  var date = new Date();
  
  var visit ={ url:userUrl,ip:userIp,date:date};
  Visit.create(visit, (err, raw)=>{
    if (err) throw err;
    console.log("visit added");
  });
}

module.exports = logRequest;