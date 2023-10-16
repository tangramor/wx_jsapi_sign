'use strict';

exports.port = 3000;
exports.companyName = process.env.COMPANY_NAME;
exports.projectName = process.env.PROJECT_NAME;
exports.systemEmail = process.env.SYSTEM_EMAIL;
exports.cryptoKey = process.env.CRYPTO_KEY;

exports.weixin = {
  localSource: process.env.LOCAL_SOURCE,
  AppId: process.env.APP_ID,
  AppSecret: process.env.APP_SECRET
};
exports.whitelist = (process.env.WHITELIST || '').split(',')

exports.debug = true;

