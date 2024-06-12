//database.js
const mysql = require('mysql');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portalberita'
});

module.exports = db;