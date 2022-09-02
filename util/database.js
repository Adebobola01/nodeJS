const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "nodejs",
    password: "Remmys2206",
});

module.exports = pool.promise();
