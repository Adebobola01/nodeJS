const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "nodejs",
    password: "Remmys2206",
});

module.exports = pool.promise();

const Sequelize = require("sequelize");
const sequelize = new Sequelize("nodejs", "root", "Remmys2206", {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;
