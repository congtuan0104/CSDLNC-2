var config = require('./dbConfig');
const sql = require('mssql/msnodesqlv8');

async function get10Products() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT TOP 10 * from SANPHAM");
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getProduct(productID) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.VarChar, productID)
            .query("SELECT * from SANPHAM where MASP = @input_parameter");
        return product.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports={
    getProduct: getProduct,
    get10Products: get10Products,
}