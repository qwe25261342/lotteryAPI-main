"use strict"
const db = require('../utils/db_config')

function runQuery(sql, params) {
  // console.log(db.format(sql, params));
  return new Promise((resolve, reject) => {
    db.query(sql, params, function (error, result, fields) {
      if (error) reject(error);
      else {
        resolve(result);
      }
    });
  });
}

module.exports = runQuery