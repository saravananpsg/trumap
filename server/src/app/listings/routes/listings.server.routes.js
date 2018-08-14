'use strict';

module.exports = function (app) {
  // Listings Routes
  var listings = require('../controllers/listings.server.controller');
  app.route('/api/listings/uralistings').get(listings.uraListings);
};
