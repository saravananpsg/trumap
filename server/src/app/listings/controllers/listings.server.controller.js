'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  chalk = require('chalk'),
  db = require(path.resolve('./src/config/lib/sequelize')),
  errorHandler = require(path.resolve('./src/app/core/controllers/errors.server.controller')),
  moment = require('moment');
const _uraListingsQuery = `SELECT *, count(*) OVER() as totalCount from
  ura_residentialtransaction order by id limit :limit offset :offset`;

const _voluntaryWelfareListQuery = `SELECT *,  count(*) OVER() as totalCount FROM
  public.voluntary_welfare_list vwl inner join voluntary_welfare_details vwd ON
  (vwl.id = vwd.id) order by vwl.id limit :limit offset :offset`

const _listingTypeQuery = `SELECT * FROM public.:listingView lv order by lv.id`;

exports.uraListings = function(req, res) {
  const query = _uraListingsQuery;
  console.log('URA Params:', req.query);
  console.log('URA Query:', query);
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
