const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const con = mysql.createConnection({
    host: 'db-asiasgn1.cdp0yah6vuxk.ca-central-1.rds.amazonaws.com',
    user: 'admin',
    password: 'W8bzxpk8',
    database: 'myawsdb',
    multipleStatements: true
});

// open the MySQL connection
con.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = con;