'use strict';

module.exports = function (app) {
  // Listings Routes
  var listings = require('../controllers/listings.server.controller');
  app.route('/api/listings/truexpert')
    .get(listings.truexpert);
  app.route('/api/listings/voluntarywelfarelistings')
      .get(listings.voluntaryWelfareList);
  app.route('/api/listings/type/:listingType')
      .get(listings.listings);

};
