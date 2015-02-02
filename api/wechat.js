'use strict';

///**
// * 获取微信token
// *
// * GET
// */
var request = require('request');



/**
 * 获取微信access_token，根据 http://mp.weixin.qq.com/wiki/15/54ce45d8d30b6bf6758f68d2e95bc627.html 要求，7200秒请求一次
 * @callmethod GET
 *
 * @return {String} 返回 JSON 字符串,包括:

 access_token: 微信访问句柄
 *
 * @example {"access_token":"546566e633068be173afdba9"}
 *
 * @exception 返回 JSON 字符串,其中 access_token 值为 null
 *
 * @example {"access_token": null}
 */
exports.getWechatToken = function (req, res) {
  getWechatToken(req, function(err, token) {
    console.log("API send token: ", token);
    res.send({access_token: token});
  });
}

function getWechatToken(req, callback) {

  var wechat_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + req.app.config.weixin.AppId + "&secret=" + req.app.config.weixin.AppSecret;

  req.app.redis.get("wechat_token", function (err, data) {  //检查缓存里wechat_token是否过期
    console.log(data ? JSON.stringify(data) : "null");
    if (!Boolean(data)) {
      //空
      getAndSetToken(function(new_token) {
        if(new_token) {
          callback(null, new_token);
        } else {  //刷新失败
          callback('Failed to get Wechat access_token', null);
        }
      });

    } else {
      var old_token = JSON.parse(data.replace(/\\|\b|\n|\f|\r|\t/g, ""));
      console.log("old access_token: ", old_token.token.access_token);
      if((new Date()).getTime() - old_token.time > 7180000) {  //token还有20秒就过期，需要刷新

        getAndSetToken(function(new_token) {
          if(new_token) {
            callback(null, new_token);
          } else {  //刷新失败
            callback(null, old_token.token.access_token);
          }
        });

      } else {  //还不需要刷新
        callback(null, old_token.token.access_token);
      }
    }

  });

  function getAndSetToken(cb) {
    request(wechat_token_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Get Wechat access token: " + body);
        var new_token = JSON.parse(body);
        if(new_token.errcode) {
          cb(null);
        } else {
          req.app.redis.set("wechat_token", '{"token": ' + body + ', "time": ' + (new Date()).getTime() + '}', function (err, out) {
            console.log("new token: " + new_token.access_token);
            cb(new_token.access_token);
          });
        }
      } else {
        cb(null);
      }
    });
  }

}


/**
 * 获取微信JS API ticket，根据 http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html 要求，7200秒请求一次
 * @callmethod GET
 *
 * @return {String} 返回 JSON 字符串,包括:

 jsapi_ticket: 微信 JS API ticket
 *
 * @example {"jsapi_ticket":"546566e633068be173afdba9"}
 *
 * @exception 返回 JSON 字符串,其中 jsapi_ticket 值为 null
 *
 * @example {"jsapi_ticket": null}
 */
exports.getWechatJsapiTicket = function (req, res) {
  getWechatJsapiTicket(req, function(err, ticket) {
    console.log("API send token: ", ticket);
    res.send({jsapi_ticket: ticket});
  });
}

function getWechatJsapiTicket (req, callback) {
  getWechatToken(req, function(err, token) {
    if(err) {

    }
    if(token) {
      var jsapi_ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + token + "&type=jsapi";

      req.app.redis.get("wechat_jsapi_ticket", function (err, data) {  //检查缓存里wechat_token是否过期
        console.log(data ? JSON.stringify(data) : "null");
        if (!Boolean(data)) {
          //空
          getAndSetTicket(function(new_ticket) {
            if(new_ticket) {
              callback(null, new_ticket);
            } else {  //刷新失败
              callback('Failed to get Wechat JS API ticket', null);
            }
          });
        } else {
          var old_ticket = JSON.parse(data.replace(/\\|\b|\n|\f|\r|\t/g, ""));
          console.log("old access_token: ", old_ticket.ticket.ticket);
          if((new Date()).getTime() - old_ticket.time > 7180000) {  //token还有20秒就过期，需要刷新

            getAndSetTicket(function(new_ticket) {
              if(new_ticket) {
                callback(null, new_ticket);
              } else {  //刷新失败
                callback(null, old_ticket.ticket.ticket);
              }
            });

          } else {  //还不需要刷新
            callback(null, old_ticket.ticket.ticket);
          }
        }

      });

      var getAndSetTicket = function (cb) {
        request(jsapi_ticket_url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("Get Wechat JS API ticket: " + body);
            var new_ticket = JSON.parse(body);

            if(new_ticket.errcode == 0) {
              req.app.redis.set("wechat_jsapi_ticket", '{"ticket": ' + body + ', "time": ' + (new Date()).getTime() + '}', function (err, out) {
                console.log("new ticket: " + new_ticket.ticket);
                cb(new_ticket.ticket);
              });
            } else {
              cb(null);
            }
          } else {
            cb(null);
          }
        });
      };
    }
  });


}

/**
 * 生成微信JS API 签名，根据 http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.951-JS-SDK.E4.BD.BF.E7.94.A8.E6.9D.83.E9.99.90.E7.AD.BE.E5.90.8D.E7.AE.97.E6.B3.95
 * @callmethod GET
 * @param {String} noncestr 必须参数，使用者自己生成的一个随机字符串，签名用的noncestr必须与wx.config中的nonceStr相同
 * @param {String} timestamp 必须参数，使用者在调用微信 JS API 时的Unix时间戳，签名用的timestamp必须与wx.config中的timestamp相同
 * @param {String} url 必须参数，签名用的url必须是调用JS接口页面的完整URL，其中的特殊字符，例如&、空格必须转义为%26、%20，参考：http://www.w3school.com.cn/tags/html_ref_urlencode.html
 *
 * @return {String} 返回 JSON 字符串,包括:

 signature: 微信 JS API 签名
 *
 * @example {"signature":"546566e633068be173afdba9"}
 *
 * @exception 返回 JSON 字符串,其中 signature 值为 null
 *
 * @example {"signature": null}
 */
exports.getWechatJsapiSign = function (req, res) {
  getWechatJsapiSign(req, function(err, signature) {
    console.log("API send signature: ", signature);
    res.send({signature: signature});
  });
}

function getWechatJsapiSign (req, callback) {
  var noncestr = req.query.noncestr;
  var timestamp = req.query.timestamp;
  var url = req.query.url;

  getWechatJsapiTicket(req, function(err, ticket) {
    var sign_str = "jsapi_ticket=" + ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
    console.log("signature string: ", sign_str);

    var jsSHA = require("jssha");
    var s = new jsSHA(sign_str, "TEXT");
    var t = s.getHash("SHA-1", "HEX");

    callback(null, t);
  });
}
