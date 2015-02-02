'use strict';

//dependencies
var config = require('./config'),
  express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  multer  = require('multer'),
  morgan = require('morgan'),
  compression = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  favicon = require('serve-favicon'),
  serveStatic = require('serve-static'),
  errorhandler = require('errorhandler'),
  RedisStore = require('connect-redis')(session),
  http = require('http'),
  path = require('path');

var app = express();


//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

//setup the session store
app.sessionStore = new RedisStore({ host: 'localhost', port: 6379 });

//redis cache
var redis = require('redis'),
	client = redis.createClient();
client.on('error',function(err){
console.log('redis-err:'+err);
});

app.redis=client;

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('strict routing', true);
app.set('project-name', config.projectName);
app.set('company-name', config.companyName);
app.set('system-email', config.systemEmail);
app.set('crypto-key', config.cryptoKey);


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(morgan('dev'));
app.use(compression());

app.use(methodOverride());
app.use(cookieParser());

app.use(session({
  secret: config.cryptoKey,
  maxAge: 2 * 3600000,
  store: app.sessionStore,
  saveUninitialized: true,
  resave: true
}));


//route requests
require('./routes')(app);



//config express in dev environment
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(errorhandler());
}


//listen up
app.server.listen(app.get('port'), function () {
  //and... we're live
});

