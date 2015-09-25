'use strict';

var wechat = require ('./api/wechat.js');

exports = module.exports = function (app) {
  //wechat token api
  app.get('/api/getWechatToken/', wechat.getWechatToken);
  app.get('/api/getWechatJsapiTicket/', wechat.getWechatJsapiTicket);
  app.get('/api/getWechatJsapiSign/', wechat.getWechatJsapiSign);

  app.get('/*', function(req, res) {
    console.log("get request: ", req.query);
    res.send("working...");
  });
};
