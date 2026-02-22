const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'threatnet_db',
    password: 'Welcome123!'
});

module.exports = pool.promise();