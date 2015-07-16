'use strict';
var wechat = require ('./api/wechat.js');
var qiniu = require ('./api/qiniu.js');

exports = module.exports = function (app) {
  app.get('/api/wechat/getToken/', wechat.getWechatToken);
  app.get('/api/wechat/getJsapiTicket/', wechat.getWechatJsapiTicket);
  app.get('/api/wechat/getJsapiSign/', wechat.getWechatJsapiSign);

  app.get('/api/qiniu/videoFormat', qiniu.videoFormat);

  app.get('/*', function(req, res) {
    console.log("get request: ", req.query);
    res.send("working...");
  });
};
