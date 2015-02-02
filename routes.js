'use strict';

exports = module.exports = function (app) {
  //wechat token api
  app.get('/api/getWechatToken/',require('./api/wechat').getWechatToken);
  app.get('/api/getWechatJsapiTicket/',require('./api/wechat').getWechatJsapiTicket);
  app.get('/api/getWechatJsapiSign/',require('./api/wechat').getWechatJsapiSign);

  app.get('/*', function(req, res) {
    console.log("get request: ", req.query);
    res.send("working...");
  });
}
