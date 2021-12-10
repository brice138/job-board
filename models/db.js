const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bdd_jobboard',
  connectionLimit: 10,
});

connection.connect((err) => {
  if (err) throw error;
  console.log('Connected to the database !');
});

module.exports = connection;
