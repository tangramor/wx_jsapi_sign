'use strict';

exports.port = process.env.PORT || 3000;
exports.companyName = 'Pairyo';
exports.projectName = 'Pairyo';
exports.systemEmail = 'pairyo@pairyo.com';
exports.cryptoKey = 'k4yb0ardc4x';

exports.port = 3001;

exports.weixin = {
  localSource: 'pairyo',
  AppId: 'wx2201e056868cb9f2',
  AppSecret: '4fe918d18efd2854f7d28cfb473cecef'
};

exports.qiniu = {
  domain     : '7xinhx.com1.z0.glb.clouddn.com',
  bucket     : 'airshowy',
  ACCESS_KEY : 'l6Rf0LgQDgpSwjdXr_MgsCynhsofRM7W2dwvIOXO',
  SECRET_KEY : 'pM0YnjO2CuMRqJjxZ6rcM3cg5stLnS9CxZFWls76'
};

exports.debug = true;
