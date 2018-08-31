'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  chalk = require('chalk'),
  config = require(path.resolve('./src/config/config')),
  db = require(path.resolve('./src/config/lib/sequelize')),
  errorHandler = require(path.resolve('./src/app/core/controllers/errors.server.controller')),
  moment = require('moment'),
  request = require('request-promise-native'),
  crypto = require('crypto');


const _voluntaryWelfareListQuery = `SELECT *,  count(*) OVER() as totalCount FROM
  public.voluntary_welfare_list vwl inner join voluntary_welfare_details vwd ON
  (vwl.id = vwd.id) order by vwl.id limit :limit offset :offset`

const _listingTypeQuery = `SELECT * FROM public.:listingView lv order by lv.id`;

function generateSignature(timestamp, secret) {
  const signatureText = `${timestamp}${secret}`
  const signature = crypto.createHash('sha256')
    .update(signatureText, 'utf8').digest('hex');
  return signature;
}


exports.voluntaryWelfareList= function(req, res) {
  const query = _voluntaryWelfareListQuery;
  console.log('VWL Params:', req.query);
  console.log('VWL Query:', query);
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;
  db.sequelize.query(query,
    { replacements: { limit: req.query.limit, offset: req.query.offset },
    type: db.sequelize.QueryTypes.SELECT })
    .then((results) => {
      return res.json(results);
    })
    .catch((err) => {
      console.log('ERROR:', err);
      return res.status(400).send(err);
    });
};

exports.listings = function(req, res) {

  let query = _listingTypeQuery;

  console.log('Listings Params:', req.params, req.query);
  console.log('Listings Query:', query);
  const listingView = `${req.params.listingType}_list`;
  query = query.replace(':listingView', listingView);
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;
  db.sequelize.query(query,
    { replacements: {
      limit: limit, offset: offset },
    type: db.sequelize.QueryTypes.SELECT })
    .then((results) => {
      return res.json(results);
    })
    .catch((err) => {
      console.log('ERROR:', err);
      return res.status(400).send(err);
    });
};


exports.truexpert = function(req, res) {
  let searchApi = config.truexpert.search.apiUrl;
  const secret = config.truexpert.search.secret;

  searchApi = `${searchApi}/?`;
  //var queryParams = ['bedroom_num=20','budget=10000','lat=1.342863','lng=103.844685',
  //  'property_types=condominium,hdb','radius=5000', 'size=20'];
  // var queryParmsStr = queryParams.join('&');
  const timestamp = Math.round(Date.now()/1000);
  //searchApi = `${searchApi}/?truexpert=1&timestamp=${timestamp}`;
  const signature = generateSignature(timestamp, secret);
  // searchApi = `${searchApi}&signature=${signature}&${queryParmsStr}`;
  // console.log('Timestamp:', timestamp, ' Signature:', signature);
  // console.log('SearchAPI:', searchApi);
  const query = Object.assign({}, req.query);
  query.truexpert = 1;
  query.timestamp = timestamp;
  query.signature = signature;
  console.log('New query:', query);
  request.get({url: searchApi, qs: query})
  .then((response) => {
    return res.json(response);
  })
  .catch((error) => {
    return res.status(400).send(error);
  });
};
