
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const config = require('../config');
const compress = require('compression');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const fs = require('fs');
const helmet = require('helmet');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const logger = require('./logger');
const consolidate = require('consolidate');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

/**
 * Initialize local variables
 *
 */
module.exports.initLocalVariables = function(app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  //app.locals.facebookAppId = config.facebook.clientID;
  //app.locals.jsFiles = config.files.client.js;
  //app.locals.cssFiles = config.files.client.css;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function(app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan)
  app.use(morgan(logger.getFormat(), logger.getOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function(app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function(app, db) {

  var sequelizeStore = new SequelizeStore({
    db: db
  });

  sequelizeStore.sync();

  // Express session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.sessionExpiration,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    key: config.sessionKey,
    store: sequelizeStore
  }));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function(app, db) {
  config.files.server.configs.forEach(function(configPath) {
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function(app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function(app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./dist')));
  //app.use(express.static(path.join(__dirname, '../../../dist')));


  // Globbing static routing
  /*config.folders.client.forEach(function(staticPath) {
    app.use(staticPath, express.static(path.resolve('./' + staticPath)));
  });*/
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function(app) {
  // Globbing policy files
  config.files.server.policies.forEach(function(policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function(app) {
  // Globbing routing files
  config.files.server.routes.forEach(function(routePath) {
    //console.log('RoutePath:',routePath,path.resolve(routePath));
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function(app) {
  app.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function(app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function(db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};


/*const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
  next();
});

app.use(express.static(path.join(__dirname, '../../dist')));



module.exports = app;
*/