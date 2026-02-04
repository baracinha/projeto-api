const mysql = require('mysql2');

const pool = mysql.createPool({

    host : 'localhost',
    user : 'root',
    port : 3306,
    password : 'lapislazuli',
    database : 'melonmessage',
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

module.exports = pool;