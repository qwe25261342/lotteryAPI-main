"use strict"
const db = require('../utils/db_config')
//promise包裝
function runQuery(sql, params) {
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