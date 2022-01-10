const db = require('../models/dbOperations');

class AdminController {
    //[GET]/admin/
    async showDashboard(req, res, next) {
        if (req.session.admin) {
            const admin= req.session.admin;
            const bestSeller = await db.getBestSeller();
            const recentOrder = await db.getRecentOrder();
            recentOrder.forEach(order => {
                if(order.TinhTrang == -1){
                    order.TinhTrang = 'Huỷ đơn';
                }
                else if(order.TinhTrang == 0){
                    order.TinhTrang = 'Chưa gửi hàng';
                }
                else if(order.TinhTrang == 1){
                    order.TinhTrang = 'Đang gửi hàng';
                }
                else{
                    order.TinhTrang = 'Đã thanh toán';
                }
            });
            res.render('./Admin/dashboard',{
                layout: 'AdminLayout',
                title: 'Dashboard',
                admin: admin,
                bestSeller: bestSeller,
                recentOrder: recentOrder,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/admin/products
    async allProducts(req, res, next) {
        if (req.session.admin) {
            const admin= req.session.admin;
            const type = await db.getAllType();
            const brand = await db.getAllBrand();
            const page = parseInt(req.query.page) || 1;
            const numberOfPage = await db.getNumberOfPage('SANPHAM');

            var pageList = [];
            if (numberOfPage <= 7) {
                for (var i = 1; i <= numberOfPage; i++) {
                    pageList.push(i);
                }
            }
            else {

                for (var i = page - 3; i < page; i++) {
                    if (i < 1) continue;
                    pageList.push(i);
                }

                for (var i = page; i <= page + 3; i++) {
                    if (i > numberOfPage) continue;
                    pageList.push(i);
                }
            }
            const productsList = await db.getProducts(page);
             
            res.render('./Admin/productList',{
                layout: 'AdminLayout',
                title: 'Sản phẩm',
                admin: admin,
                brand: brand,
                type: type,
                page: page,
                numberOfPage: numberOfPage,
                pageList: pageList,
                products: productsList,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/admin/search
    async search(req, res, next) {
        if (req.session.admin) {
            const admin= req.session.admin;
            const productName = req.query.q;
            const products = await db.search2(productName);
            const type = await db.getAllType();
            const brand = await db.getAllBrand();
                     
            res.render('./Admin/productList',{
                layout: 'AdminLayout',
                title: 'Sản phẩm',
                admin: admin,
                brand: brand,
                type: type,
                products: products,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


     //[POST]/admin/addProduct
     async addProduct(req, res) {
        if (req.session.admin) {
        
            const productName = req.body.productName;
            const type = req.body.type;
            const brand = req.body.brand;
            const price = req.body.price;
            const expiry = req.body.expiry;
            const add = await db.addProduct(productName,type,brand,price,expiry);

            if(add == 0){
                res.send('Thêm sản phẩm thất bại');
                return;
            }
            res.redirect('/admin/products');
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/admin/removeProduct
    async removeProduct(req, res) {
        if (req.session.admin) {
        
            const productID = req.query.productID;
            const remove = await db.removeProduct(productID);

            if(remove == 0){
                res.send('Xoá sản phẩm thất bại');
                return;
            }
            res.redirect('/admin/products');
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/admin/product/:productID
    async productDetail(req, res, next) {
        if (req.session.admin) {
            const productID = req.params.productID;
            const admin= req.session.admin;
            var type = await db.getAllType();
            const brand = await db.getAllBrand();
            const product = await db.getProductDetail(productID);
            const branch = await db.getProductQuantity(productID);
            const priceHistory = await db.getPriceHistory(productID);
            const discount = await db.getDiscount2(productID);
            if(discount){
                discount.at(0).Giam = discount.at(0).Giam * 100;
            }
            
             
            res.render('./Admin/productDetail',{
                layout: 'AdminLayout',
                title: 'Sản phẩm',
                admin: admin,
                brand: brand,
                type: type,
                product: product,
                branch: branch,
                priceHistory: priceHistory,
                discount: discount,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[POST]//admin/updateProduct
    async updateProduct(req, res, next) {
        if (req.session.admin) {
            const productID = req.body.productID;
            const productName = req.body.productName;
            const expiry = req.body.expiry;
            const type = req.body.type;
            const brand = req.body.brand;
            const price = req.body.price;
            const update = await db.updateProduct(productID,productName,expiry,type,brand,price);
            if(update==0){
                res.send('Cập nhật thất bại');
                return;
            }
            console.log('Cập nhật thành công');
            res.redirect('/admin/products');
            return;
        }
        res.redirect('/sign-in');
    }

    //[POST]//admin/addDiscount
    async addDiscount(req, res, next) {
        if (req.session.admin) {
            const productID = req.body.productID;
            const discountRate = req.body.discountRate/100;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const add = await db.addDiscount(productID,discountRate,startDate,endDate);
            if(add==0){
                res.send('Thiết lập đợt giảm giá thất bại');
                return;
            }
            console.log('Thiết lập đợt giảm giá thành công');
            res.redirect('/admin/products');
            return;
        }
        res.redirect('/sign-in');
    }


    //[POST]//admin/updateDiscount
    async updateDiscount(req, res, next) {
        if (req.session.admin) {
            console.log(req.body);
            const productID = req.body.productID;
            const discountRate = req.body.discountRate/100;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const update = await db.updateDiscount(productID,discountRate,startDate,endDate);
            if(update==0){
                res.send('Cập nhật thất bại');
                return;
            }
            console.log('Cập nhật thành công');
            res.redirect('/admin/products');
            return;
        }
        res.redirect('/sign-in');
    }


    //[POST]//admin/removeDiscount
    async removeDiscount(req, res, next) {
        if (req.session.admin) {

            const productID = req.body.productID;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const remove = await db.removeDiscount(productID,startDate,endDate);
            if(remove==0){
                res.send('Xoá thất bại');
                return;
            }
            console.log('Xoá thành công');
            res.redirect('/admin/products');
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/admin/staff
    async staff(req, res, next) {
        if (req.session.admin) {
            const admin = req.session.admin;
            const staffList = await db.getAllStaff();
            staffList.forEach(staff => {
                if(staff.LoaiNhanVien==0){
                    staff.LoaiNhanVien='Nhân viên bán hàng';
                }
                else{
                    staff.LoaiNhanVien='Trưởng chi nhánh';
                }
            });

            res.render('./Admin/staff', {
                layout: 'AdminLayout',
                title: 'Nhân viên',
                admin: admin,
                staff: staffList,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/admin/staff/staffID
    async staffDetail(req, res, next) {
        if (req.session.admin) {
            const admin = req.session.admin;
            const staffID = req.params.staffID;
            const staff = await db.getStaffDetail(staffID);
            if(staff.at(0).LoaiNhanVien==0){
                staff.at(0).LoaiNhanVien='Nhân viên bán hàng';
            }
            else{
                staff.at(0).LoaiNhanVien='Quản lý chi nhánh';
            }
            const salaryHistory = await db.getSalaryHistory(staffID);
            
            salaryHistory.forEach(element => {
                element.BiTru= element.SoNgayNghiTrongThang*380000;
                element.HieuSuat = element.DoanhThu/element.ChiTieu;
                if(element.DoanhThu>element.ChiTieu){
                    element.Thuong = 200000;
                }
                else{
                    element.Thuong = 0;
                }
            });


            res.render('./Admin/staffDetail', {
                layout: 'AdminLayout',
                title: 'Nhân viên',
                admin: admin,
                staff: staff,
                salaryHistory: salaryHistory,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/admin/warehouse
    async warehouseEntryHistory(req, res) {
        if (req.session.admin) {
            const admin= req.session.admin;           
            let page;
            if(req.query.page){
                page=req.query.page;
            }
            else{
                page=1;
            }
            if(page<1){
                page=1;
            }
            const importHistory = await db.getImportHistory(page);
             
            res.render('./Admin/warehouse',{
                layout: 'AdminLayout',
                title: 'Quản lý kho',
                admin: admin,
                page: page,
                batch: importHistory,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/admin/orders
    async allOrders(req, res, next) {
        if (req.session.admin) {
            const admin= req.session.admin;
            let page;
            if(req.query.page){
                page=req.query.page;
            }
            else{
                page=1;
            }
            if(page<1){
                page=1;
            }
            const ordersList = await db.getAllOrders(page);
            ordersList.forEach(order => {
                if(order.TinhTrang == 0){
                    order.TinhTrang = 'Chưa gửi hàng';
                }
                else if(order.TinhTrang == 1){
                    order.TinhTrang = 'Đang gửi hàng';
                }
                else{
                    order.TinhTrang = 'Đã thanh toán';
                }
            });
             
            res.render('./Admin/orders',{
                layout: 'AdminLayout',
                title: 'Đơn hàng',
                admin: admin,
                page: page,
                orders: ordersList,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/admin/turnover
    async showTurnover(req, res, next) {
        if (req.session.admin) {
            const admin= req.session.admin;
            let page;
            if(req.query.page){
                page=req.query.page;
            }
            else{
                page=1;
            }
            if(page<1){
                page=1;
            }
            const allTurnover = await db.showTurnover(page);
                      
             
            res.render('./Admin/turnover',{
                layout: 'AdminLayout',
                title: 'Doanh thu',
                admin: admin,
                turnover: allTurnover,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/admin/statistic
    async statistic(req, res) {
        if (req.session.admin) {
            const admin= req.session.admin;
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();

            let page;
            if(req.query.page){
                page=req.query.page;
            }
            else{
                page=1;
            }
            if(page<1){
                page=1;
            }
            const allTurnover = await db.showTurnover(page);
            const bestSeller = await db.getBestSeller2();
                                 
            res.render('./Admin/statistic',{
                layout: 'AdminLayout',
                title: 'Thống kê',
                admin: admin,
                month: month,
                year: year,
                turnover: allTurnover,
                products: bestSeller,
                cssP:() => 'css',
                scriptP:() => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }
}

module.exports = new AdminController;