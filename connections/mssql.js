var sql = require('mssql/msnodesqlv8');

var config = {
    server: "server-one\\mssql2012",
    user: "admin",
    password: "fpt@entent123",
    database: "Clinic_PK68",
    driver : "msnodesqlv8"
};

const conn = new sql.ConnectionPool(config).connect().then(pool =>{
    return pool;
});

module.exports = {
    conn: conn,
    sql: sql

}