const mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'db_mhs'
});

connection.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log('succes connect db')
  }
});

module.exports = connection;