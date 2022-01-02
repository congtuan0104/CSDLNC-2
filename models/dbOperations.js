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

async function getAllProducts() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT * from SANPHAM");
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getProducts(page) {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('startOffset', sql.Int, (page - 1) * 20)
            .query(`SELECT * from SANPHAM s, THUONGHIEU t
        where s.MaThuongHieu=t.MaThuongHieu 
        order by MaSP OFFSET @startOffset rows FETCH NEXT 20 rows ONLY`);
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

async function getDiscount(productID) {
    try {
        let pool = await sql.connect(config);
        let discount = await pool.request()
            .input('input_parameter', sql.Int, productID)
            .query("SELECT convert(varchar(10), d.NgayBatDau, 105) AS NgayBatDau,"
                + " convert(varchar(10), d.NgayKetThuc, 105) AS NgayKetThuc, Giam"
                + " from DOTGIAMGIA d"
                + " where MASP = @input_parameter"
                + " AND datediff(minute,getdate() - 1, d.NgayKetThuc) >= 0"
                + " AND datediff(minute,getdate() - 1, d.NgayBatDau) <= 0");
        if (discount.recordset.length == 0) return null;
        return discount.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getDiscount2(productID) {
    try {
        let pool = await sql.connect(config);
        let discount = await pool.request()
            .input('input_parameter', sql.Int, productID)
            .query("SELECT convert(varchar(10), d.NgayBatDau, 120) AS NgayBatDau,"
                + " convert(varchar(10), d.NgayKetThuc, 120) AS NgayKetThuc, Giam"
                + " from DOTGIAMGIA d"
                + " where MASP = @input_parameter"
                + " AND datediff(minute,getdate() - 1, d.NgayKetThuc) >= 0"
                + " AND datediff(minute,getdate() - 1, d.NgayBatDau) <= 0");
        if (discount.recordset.length == 0) return null;
        return discount.recordset;
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


async function getProductQuantity(productID) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('masp', sql.Int, productID)
            .query(`SELECT * FROM CHINHANH c,SANPHAM_CHINHANH cs
                WHERE c.MaCN = cs.MaCN AND MaSP=@masp`);
        return product.recordset;
    }
    catch (error) {
        console.log(error);
    }
}


async function addNewUser(name, address, phone) {
    try {
        let pool = await sql.connect(config);
        const request = await pool.request();
        request.input('TenKH', sql.NVarChar(50), name);
        request.input('DiaCHi', sql.NVarChar(200), address);
        request.input('SDT', sql.Char(10), phone);
        try {
            await request.query("insert into KHACHHANG (TenKH,DiaChi,SDT) values (@TenKH,@DiaChi,@SDT)");
            console.log('Đăng ký thành công');
            return 1;
        } catch (error) {
            console.log(error);
            return 0;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
}

async function verifyCustomer(phone) {
    try {
        let pool = await sql.connect(config);
        let customer = await pool.request()
            .input('input_parameter', sql.Char(10), phone)
            .query("SELECT * FROM KHACHHANG WHERE SDT = @input_parameter");
        if (customer.recordset.length == 0) return null;
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
        if (staff.recordset.length == 0) return null;
        return staff.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function search(searchName) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.VarChar, '%' + searchName + '%')
            .query("SELECT * FROM SANPHAM WHERE TenSP LIKE @input_parameter");
        if (product.recordset.length == 0) return null;
        return product.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function search2(searchName) {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.VarChar, '%' + searchName + '%')
            .query(`SELECT * from SANPHAM s, THUONGHIEU t
                    where s.MaThuongHieu=t.MaThuongHieu AND TenSP LIKE @input_parameter
                    order by MaSP`);
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function addToOrder(customerID, address, grandTotal, branchID, staffID) {
    try {
        let pool = await sql.connect(config);
        let order = await pool.request()
            .input('DiaChi', sql.NVarChar(100), address)
            .input('MaKH', sql.Int, customerID)
            .input('MaCN', sql.Int, branchID)
            .input('MaNV', sql.Int, staffID)
            .input('TongTien', sql.Money, grandTotal)
            .execute('sp_THEM_HD');

        return order.recordset.at(0).MaHD;     
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function getOrderID(customerID) {
    try {
        let pool = await sql.connect(config);
        let orderID = await pool.request()
            .input('MaKH', sql.Int, customerID)
            .query("Select max(mahd)as newID from hoadon where makh=@MaKH");

        return orderID.recordset.at(0).newID;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function addOrderDetail(orderID, customerID, productID, branchID, cost, discount, quantity, total) {
    try {
        let pool = await sql.connect(config);
        let orderDetail = await pool.request();
        orderDetail.input('mahd', sql.Int, orderID);
        orderDetail.input('makh', sql.Int, customerID);
        orderDetail.input('masp', sql.Int, productID);
        orderDetail.input('macn', sql.Int, branchID);
        orderDetail.input('giaban', sql.Money, cost);
        orderDetail.input('giagiam', sql.Money, discount);
        orderDetail.input('soluong', sql.Int, quantity);
        orderDetail.input('thanhtien', sql.Money, total);
        orderDetail.execute('sp_THEM_SP_VAO_HD');
        return orderDetail.rowsAffected;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

async function showAllOrder(customerID) {
    try {
        let pool = await sql.connect(config);
        let orders = await pool.request()
            .input('MaKH', sql.Int, customerID)
            .query("Select convert(varchar(10), NgayLap, 105) AS NgayLap,"
                + " MaHD, DiaChiNhanHang, TongTien, MaKH, MaNV, TinhTrang"
                + " from hoadon where makh=@MaKH");
        if (orders.recordset.length == 0) return null;
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function addShoppingHistory(customerID, productID) {
    try {
        let pool = await sql.connect(config);
        let orderDetail = await pool.request()
            .input('MaKH', sql.Int, customerID)
            .input('MaSP', sql.Int, productID)
            .query("insert into LS_MUAHANG(MaKH,MaSP) values(@MaKH,@MaSP)");
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

async function increaseRevenue(storeID, money) {
    try {
        let pool = await sql.connect(config);
        let revenue = await pool.request()
        revenue.input('MaCN', sql.Int, storeID)
        revenue.input('money', sql.Int, money)
        revenue.query(
            `IF NOT EXISTS(SELECT * FROM CHITIEU_DOANHTHU WHERE DT_Thang=MONTH(GETDATE()) AND DT_Nam=YEAR(GETDATE())
            BEGIN
                INSERT CHITIEU_DOANHTHU(DT_Thang,DT_Thang,DoanhThu,MaCN) VALUES(MONTH(GETDATE()), YEAR(GETDATE()),0)
            END
            DECLARE @doanhthu MONEY = (SELECT DoanhThu FROM CHITIEU_DOANHTHU WHERE DT_Thang=MONTH(GETDATE()) AND DT_Nam=YEAR(GETDATE())
            SET @doanhthu = @doanhthu + @money
            UPDATE CHITIEU_DOANHTHU SET DOANHTHU = @doanhthu WHERE DT_Thang=MONTH(GETDATE()) AND DT_Nam=YEAR(GETDATE()`);
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

async function showHistory(customerID) {
    try {
        let pool = await sql.connect(config);
        let history = await pool.request()
            .input('input_parameter', sql.Int, customerID)
            .query("SELECT S.MaSP, TenSP, GiaBan from LS_MUAHANG LS, SANPHAM S where MAKH = @input_parameter AND LS.MaSP=S.MaSP");
        return history.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getOrderList(orderID) {
    try {
        let pool = await sql.connect(config);
        let detail = await pool.request()
            .input('input_parameter', sql.Int, orderID)
            .query("SELECT h.MaHD, ct.MaSP, TenSP, ct.GiaBan, GiaGiam, SoLuong, ThanhTien"
                + " FROM HOADON h, CT_HOADON ct, SANPHAM s"
                + " WHERE h.MAHD = ct.MAHD AND h.MaHD=@input_parameter AND ct.MaSP=s.MaSP");
        if (detail.recordset.length == 0) return null;
        return detail.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getOrderDetail(orderID) {
    try {
        let pool = await sql.connect(config);
        let detail = await pool.request()
            .input('input_parameter', sql.Int, orderID)
            .query("SELECT h.MaHD, convert(varchar(10), NgayLap, 105) AS NgayLap, DiaChiNhanHang, TongTien, TenNV, TinhTrang"
                + " FROM HOADON h LEFT JOIN NHANVIEN n ON h.MaNV=n.MaNV"
                + " WHERE h.MaHD=@input_parameter");
        if (detail.recordset.length == 0) return null;
        return detail.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllType() {
    try {
        let pool = await sql.connect(config);
        let type = await pool.request()
            .query("SELECT * FROM LOAISANPHAM");
        if (type.recordset.length == 0) return null;
        return type.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllBrand() {
    try {
        let pool = await sql.connect(config);
        let brand = await pool.request()
            .query("SELECT * FROM THUONGHIEU");
        if (brand.recordset.length == 0) return null;
        return brand.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllBranch() {
    try {
        let pool = await sql.connect(config);
        let branch = await pool.request()
            .query("SELECT * FROM CHINHANH");
        if (branch.recordset.length == 0) return null;
        return branch.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function addProduct(productName, type, brand, price, expiry) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request();
        product.input('TenSP', sql.NVarChar, productName);
        product.input('LoaiSP', sql.INT, type);
        product.input('ThuongHieu', sql.Int, brand);
        product.input('Gia', sql.Money, price);
        product.input('HSD', sql.Int, expiry);
        product.execute('sp_THEM_SP');
        return 1;
    }
    catch (error) {
        if (error) {
            console.log(error);
            return 0;
        }
        return 1;
    }
}

async function removeProduct(productID) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request();
        product.input('MaSP', sql.Int, productID);
        product.query('DELETE FROM SANPHAM WHERE MaSP=@MaSP');
        if (product.error) {
            return 0;
        }
        return 1;
    }
    catch (error) {
        if (error) {
            console.log(error);
            return 0;
        }
    }
}


async function getPriceHistory(productID) {
    try {
        let pool = await sql.connect(config);
        let history = await pool.request()
            .input('MaSP', sql.Int, productID)
            .query(`SELECT convert(varchar(10), ThoiGian, 105) AS NgayCapNhat,
                CONVERT(VARCHAR, ThoiGian, 108) AS GioCapNhat,
                GiaBan, MaSP FROM VETGIA WHERE MaSP=@MaSP`);
        if (history.recordset.length == 0) return null;
        return history.recordset;
    }
    catch (error) {
        if (error) {
            console.log(error);
            return 0;
        }
    }
}

async function updateProduct(productID, productName, expiry, type, brand, price) {
    try {
        let pool = await sql.connect(config);
        let update = await pool.request();
        update.input('masp', sql.Int, productID);
        update.input('maloai', sql.Int, type);
        update.input('math', sql.Int, brand);
        update.input('ten', sql.NVarChar, productName);
        update.input('gia', sql.Int, price);
        update.input('hansd', sql.Int, expiry);
        update.execute('sp_updateProduct');

        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function updateDiscount(productID, discountRate, startDate, endDate) {
    try {
        let pool = await sql.connect(config);
        let update = await pool.request();
        update.input('masp', sql.Int, productID);
        update.input('giam', sql.Float, discountRate);
        update.input('ngayBD', sql.Date, startDate);
        update.input('ngayKT', sql.Date, endDate);
        update.query(`UPDATE DOTGIAMGIA SET Giam=@giam WHERE MaSP=@masp 
            AND NgayBatDau=@ngayBD AND  NgayKetThuc = @ngayKT`);
        //if(error) return 0;
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function confirmOrder(orderID) {
    try {
        let pool = await sql.connect(config);
        let confirm = await pool.request();
        confirm.input('MaHD', sql.Int, orderID);
        confirm.query(`UPDATE HOADON SET TinhTrang=2 WHERE MaHD=@MaHD`);
        //if(error) return 0;
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function cancelOrder(orderID) {
    try {
        let pool = await sql.connect(config);
        let cancel = await pool.request();
        cancel.input('MaHD', sql.Int, orderID);
        cancel.query(`UPDATE HOADON SET TinhTrang=-1 WHERE MaHD=@MaHD`);
        //if(error) return 0;
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

async function addDiscount(productID, discountRate, startDate, endDate) {
    try {
        let pool = await sql.connect(config);
        let update = await pool.request();
        update.input('masp', sql.Int, productID);
        update.input('giam', sql.VarChar, discountRate);
        update.input('ngayBD', sql.Date, startDate);
        update.input('ngayKT', sql.Date, endDate);
        update.query(`INSERT DOTGIAMGIA (NgayBatDau,NgayKetThuc,MaSP,Giam)
                        VALUES (@ngayBD,@ngayKT,@masp,@giam)`);
        //if(error) return 0;
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}

async function removeDiscount(productID, startDate, endDate) {
    try {
        let pool = await sql.connect(config);
        let update = await pool.request();
        remove.input('masp', sql.Int, productID);
        remove.input('ngayBD', sql.Date, startDate);
        remove.input('ngayKT', sql.Date, endDate);
        remove.query(`DELETE DOTGIAMGIA WHERE MaSP=@masp 
        AND NgayBatDau=@ngayBD AND  NgayKetThuc = @ngayKT`);
        //if(error) return 0;
        return 1;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function getImportHistory(page) {
    try {
        let pool = await sql.connect(config);
        let history = await pool.request()
            .input('startOffset', sql.Int, (page - 1) * 20)
            .query(`SELECT D.MADOT,D.MACN,CONVERT(VARCHAR(10),NGAYNHAP,105) AS NGAYNHAP, TENSP, SOLUONG
                    FROM LS_NHAP_KHO D, CHITIET_NHAPHANG CT, SANPHAM S
                    WHERE D.MADOT=CT.MADOT AND CT.MASP=S.MASP
                    ORDER BY MADOT OFFSET @startOffset ROWS FETCH NEXT 20 rows ONLY`);
        return history.recordset;
    }
    catch (error) {
        console.log(error);
    }
}


async function getAllOrders(page) {
    try {
        let pool = await sql.connect(config);
        let order = await pool.request()
            .input('startOffset', sql.Int, (page - 1) * 20)
            .query(`SELECT MaHD,MaKH,MaNV,CONVERT(VARCHAR(19),NgayLap,120) AS NgayLap, DiaChiNhanHang,TongTien,TinhTrang, MaCN
                    FROM HOADON
                    WHERE TinhTrang <> -1
                    ORDER BY TinhTrang ASC, MAHD ASC
                    OFFSET @startOffset ROWS FETCH NEXT 20 rows ONLY`);
        return order.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function showTurnover(page) {
    try {
        let pool = await sql.connect(config);
        let turnover = await pool.request()
            .input('startOffset', sql.Int, (page - 1) * 20)
            .query(`SELECT DT_Thang AS Thang, DT_Nam AS Nam, SUM(DOANHTHU) AS TongDoanhThu,
                    SUM(ChiTieu) AS ChiTieu FROM CHITIEU_DOANHTHU
                    GROUP BY DT_Thang, DT_Nam
                    ORDER BY DT_Nam DESC, DT_Thang ASC
                    OFFSET @startOffset ROWS FETCH NEXT 20 rows ONLY`);
        return turnover.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getBestSeller() {
    try {
        let pool = await sql.connect(config);
        let seller = await pool.request()
            .query(`SELECT TOP 7 s.MaSP, TenSP, SLBan, GiaBan 
                FROM SANPHAM s, SANPHAM_TIEUTHU st
                WHERE s.MaSP=st.MaSP AND Thang=MONTH(GETDATE()) AND Nam=YEAR(GETDATE())
                ORDER BY SLBan DESC`);
        return seller.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getBestSeller2() {
    try {
        let pool = await sql.connect(config);
        let seller = await pool.request()
            .query(`SELECT TOP 20 s.MaSP, TenSP, SLBan, GiaBan, TongSoLuongTon
                FROM SANPHAM s, SANPHAM_TIEUTHU st
                WHERE s.MaSP=st.MaSP AND Thang=MONTH(GETDATE()) AND Nam=YEAR(GETDATE())
                ORDER BY SLBan DESC`);
        return seller.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getRecentOrder() {
    try {
        let pool = await sql.connect(config);
        let orders = await pool.request()

            .query(`SELECT TOP 8 CONVERT(VARCHAR(10),NgayLap,105) AS NgayLap,
                TinhTrang, TenKH, TongTien, MaHD
                FROM HOADON h, KHACHHANG k
                WHERE h.MaKH = k.MaKH
                ORDER BY MaHD DESC`);
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllProducts: getAllProducts,
    getProducts: getProducts,
    getProduct: getProduct,
    get10Products: get10Products,
    getProductDetail: getProductDetail,
    addNewUser: addNewUser,
    verifyCustomer: verifyCustomer,
    verifyStaff: verifyStaff,
    search: search,
    search2: search2,
    getDiscount: getDiscount,
    getDiscount2: getDiscount2,
    addToOrder: addToOrder,
    addOrderDetail: addOrderDetail,
    addShoppingHistory: addShoppingHistory,
    showHistory: showHistory,
    showAllOrder: showAllOrder,
    getOrderDetail: getOrderDetail,
    getOrderList: getOrderList,
    getAllBranch: getAllBranch,
    getAllBrand: getAllBrand,
    getAllType: getAllType,
    addProduct: addProduct,
    removeProduct: removeProduct,
    getProductQuantity: getProductQuantity,
    getPriceHistory: getPriceHistory,
    updateProduct: updateProduct,
    updateDiscount: updateDiscount,
    addDiscount: addDiscount,
    removeDiscount: removeDiscount,
    getImportHistory: getImportHistory,
    confirmOrder: confirmOrder,
    cancelOrder: cancelOrder,
    getAllOrders: getAllOrders,
    showTurnover: showTurnover,
    increaseRevenue: increaseRevenue,
    getOrderID: getOrderID,
    getBestSeller: getBestSeller,
    getBestSeller2: getBestSeller2,
    getRecentOrder: getRecentOrder,
}