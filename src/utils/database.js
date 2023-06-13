'use strict';

const fs = require('fs');

const getFAQsFromDB = () => {
  let raw = fs.readFileSync('./testDB.json');
  return JSON.parse(raw);
};

module.exports = { getFAQsFromDB };
