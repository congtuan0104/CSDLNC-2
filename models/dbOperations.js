var config = require('./dbConfig');
const sql = require('mssql/msnodesqlv8');

async function get10Products() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT TOP 20 * from SANPHAM");
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
            .input('input_parameter', sql.Int, productID)
            .query("SELECT * from SANPHAM where MASP = @input_parameter");
        return product.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getProductDetail(productID) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, productID)
            .query("SELECT SP.MaSP,TenSP,TenLoai,HanSuDung,GiaBan,TenThuongHieu,TongSoLuongTon"
                + " FROM SANPHAM SP,LOAISANPHAM LSP, THUONGHIEU TH"
                + " WHERE SP.MASP = @input_parameter AND SP.MaLoai = LSP.MaLoai AND TH.MaThuongHieu=SP.MaThuongHieu");
        return product.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

    // const table = new sql.Table('KHACHHANG'); // or temporary table, e.g. #temptable
    // table.create = false;
    // table.rows.add('KH1000',name, address,phone,email);

    // const request = new sql.Request()
    // request.bulk(table, (err, result) => {
    //     err => console.log(err);
    //     result => console.log("Thêm khách hàng thành công");
    // })

async function addNewUser(name, address, phone) {
    try {
        let pool = await sql.connect(config);
        const request = await pool.request();
        request.input('TenKH', sql.NVarChar(50), name);
        request.input('DiaCHi', sql.NVarChar(200), address);
        request.input('SDT', sql.Char(10), phone);
        const newUser = await request.query("insert into KHACHHANG (TenKH,DiaChi,SDT) values (@TenKH,@DiaChi,@SDT)");
        console.log(newUser.recordset);
        console.log('Đăng ký thành công');
    } catch (error) {
        console.log(error);
    }
}

async function verifyCustomer(phone) {
    try {
        let pool = await sql.connect(config);
        let customer = await pool.request()
            .input('input_parameter', sql.Char(10), phone)
            .query("SELECT * FROM KHACHHANG WHERE SDT = @input_parameter");
            if(customer.recordset.length == 0) return null;
        return customer.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function verifyStaff(phone) {
    try {
        let pool = await sql.connect(config);
        let staff = await pool.request()
            .input('input_parameter', sql.Char(10), phone)
            .query("SELECT * FROM NHANVIEN WHERE SDT = @input_parameter");
            if(staff.recordset.length == 0) return null;
        return staff.recordset;
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = {
    getProduct: getProduct,
    get10Products: get10Products,
    getProductDetail: getProductDetail,
    addNewUser: addNewUser,
    verifyCustomer: verifyCustomer,
    verifyStaff: verifyStaff,
}