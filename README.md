# wx_jsapi_sign
The Nodejs server for manage Wechat (Wexin) access_token, jsapi ticket and signature generation. 用于管理微信JS API的access_token、ticket和根据参数生成签名

## 使用方法
1. 将config.example.js拷贝为config.js，修改配置文件内的AppId和AppSecret，其他参数也可以根据自己需求修改
2. 在项目根目录下运行 npm install，安装依赖模块
3. 在项目根目录下运行 node app.js，即可按照routes.js里的路径来调用相关API了，例如：
```
http://localhost:3000/api/getWechatJsapiSign/
```
