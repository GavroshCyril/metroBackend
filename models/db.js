const mysql = require("mysql");
const dbConfig = require("./config.js");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Успешное подключение к базе данных");
});

module.exports = connection;
