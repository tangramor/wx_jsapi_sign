# wx_jsapi_sign
The Nodejs server for manage Wechat (Wexin) access_token, jsapi ticket and signature generation. 用于管理微信JS API的access_token、ticket和根据参数生成签名
使用了Redis作为数据存储，所以在运行环境中必须安装了redis服务器

## 使用方法
1. 将config.example.js拷贝为config.js，修改配置文件内的AppId和AppSecret，其他参数也可以根据自己需求修改
2. 在项目根目录下运行 npm install，安装依赖模块
3. 在项目根目录下运行 node app.js，即可按照routes.js里的路径来调用相关API了，例如：
```
http://localhost:3000/api/getWechatJsapiSign/
```

## 接口
### getWechatToken
获取微信 access token，7200秒刷新一次 ( http://mp.weixin.qq.com/wiki/15/54ce45d8d30b6bf6758f68d2e95bc627.html )

参数：需要正确设置config.js


### getWechatJsapiTicket
获取微信 JS API 所要求的 ticket，7200秒刷新一次 ( http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html )

参数：需要正确设置config.js


### getWechatJsapiSign
根据用户参数生成微信 JS API 要求的签名 ( http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html )

参数：
 * noncestr 必须参数，使用者自己生成的一个随机字符串，签名用的noncestr必须与wx.config中的nonceStr相同
 * timestamp 必须参数，使用者在调用微信 JS API 时的Unix时间戳，签名用的timestamp必须与wx.config中的timestamp相同
 * url 必须参数，签名用的url必须是调用JS接口页面的完整URL，其中的特殊字符，例如&、空格必须转义为%26、%20，参考：http://www.w3school.com.cn/tags/html_ref_urlencode.html
