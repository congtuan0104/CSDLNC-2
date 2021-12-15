const sql = require('mssql/msnodesqlv8');

const config = {
    user: 'PCT',
    password: '1234',
    server: 'CONGTUAN\\CONGTUAN',
    driver: 'msnodesqlv8',
    database: 'DoAn01_N1',
    port: 1433,
    options: {
        trustedConnection: true
    }
}

async function connect(){
    try {
        await sql.connect(config, function (err) {
            // let sqlRequest = new sql.Request();
            // let sqlQuery = 'Select * From BOMON';
            // sqlRequest.query(sqlQuery, function (err, data) {
            //     console.table(data.recordset);
            console.log('Kết nối thành công');
            // });
        });
        
    } catch (err) {
        console.log('Kết nối không thành công');
    }
}

module.exports = config;

