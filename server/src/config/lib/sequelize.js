var config = require('../config'),
  env = process.env.NODE_ENV || 'development',
  fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize');

var db = {};

// Sequelize
/*var sequelize = new Sequelize(config.db.options.database, config.db.options.username, config.db.options.password, {
  dialect: 'mssql',
  dialectModulePath: 'sequelize-msnodesqlv8',
  dialectOptions: {
    instanceName: config.db.options.instanceName,
    trustedConnection: true,
    database: config.db.options.database
  },
  logging: config.db.options.logging,
  host: config.db.options.host,
  port: '1433',
  operatorsAliases: false
});*/
var sequelize = new Sequelize(config.db.options.database,
  config.db.options.username,
  config.db.options.password,
  config.db.options)
// Import models
config.files.server.models.forEach(function(modelPath) {
  //console.log('sequelize.js:',modelPath)
  var model = sequelize.import(path.resolve(modelPath));
  db[model.name] = model;
});

// Associate models
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
