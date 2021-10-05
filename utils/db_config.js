const mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'xiang',
  charset:'utf8mb4'
});

//連接數據庫
connection.connect(function(err){
  if(err){
    console.log(err);
    return;
  };
  console.log("connected "+ connection.threadId)
});


module.exports = connection;