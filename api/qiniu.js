'use strict';

var qiniu = require('qiniu');
var request = require('request');
var urlencode = require('urlencode');
var config = require('../config');
var _ = require('underscore');

/*
 * possible states of a pfop requst
 * @const
 */
var STATE = {
  SUCC: 0,
  WAIT: 1,
  PROCESSING: 2,
  PROCESSING_FAILED: 3,
  SUBMIT_FAILED: 4
};

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

exports.videoFormat = function(req, res) {
  var video_url = req.query.video_url;
  qiniu.fop.pfop(config.qiniu.bucket, video_url, 'avthumb/mp4', {}, _.partial(videoFormat, _, _, _, res));
};

function videoFormat(err, result, response, serverRes) {
  var persistentId = (eval(result).persistentId);
  var statusURL = "http://api.qiniu.com/status/get/prefop?id=" + urlencode(persistentId.toString());
  function checkStatus(statusURL) {
    request(statusURL, function(error, reponse, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);

        switch (result.code) {
          case STATE.SUCC:
            var items = result.items;
            var video_url = 'http://' + config.qiniu.domain + '/' + items[0].key;
            serverRes.json({
              video_url: video_url
            });
            break;
          case STATE.WAIT:
            console.log('Waiting');
            setTimeout(checkStatus.bind(null, statusURL), 1000);
            break;
          case STATE.PROCESSING:
            console.log('Processing');
            setTimeout(checkStatus.bind(null, statusURL), 500);
            break;
          case STATE.PROCESSING_FAILED:
            console.log('Processing failed!');
            break;
          case STATE.SUBMIT_FAILED:
            console.log('Submit failed!');
            break;
          default:
            console.log("Unknown state!");
        }
      } else {
        console.log("Query status failed!");
      }
    });
  }
  checkStatus(statusURL);
}
