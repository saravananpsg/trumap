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
const _uraListingsQuery = `SELECT *, count(*) OVER() as totalCount from ura_residentialtransaction order by id
  limit :limit offset :offset`

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
