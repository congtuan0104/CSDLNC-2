const db = require('../models/dbOperations');

class ManagerController {
    //[GET]/manager/
    async showDashboard(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
            const bestSeller = await db.getBestSeller();
            const recentOrder = await db.getRecentOrderBranch(manager.at(0).MaCN);

            recentOrder.forEach(order => {
                if (order.TinhTrang == -1) {
                    order.TinhTrang = 'Huỷ đơn';
                }
                else if (order.TinhTrang == 0) {
                    order.TinhTrang = 'Chưa gửi hàng';
                }
                else if (order.TinhTrang == 1) {
                    order.TinhTrang = 'Đang gửi hàng';
                }
                else {
                    order.TinhTrang = 'Đã thanh toán';
                }
            });
            res.render('./Manager/dashboard', {
                layout: 'ManagerLayout',
                title: 'Dashboard',
                manager: manager,
                bestSeller: bestSeller,
                recentOrder: recentOrder,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/manager/products
    async allProducts(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
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
            const productsList = await db.getProductBranch(manager.at(0).MaCN, page);
            productsList.forEach(product => {
                if (!product.SLBan) {
                    product.SLBan = 0;
                }
            });

            res.render('./Manager/productList', {
                layout: 'ManagerLayout',
                title: 'Sản phẩm',
                manager: manager,
                page: page,
                numberOfPage: numberOfPage,
                pageList: pageList,
                products: productsList,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/manager/search
    async search(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
            const productName = req.query.q;
            const products = await db.search2(productName);

            res.render('./Manager/productList', {
                layout: 'ManagerLayout',
                title: 'Sản phẩm',
                manager: manager,
                products: products,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }



    //[GET]/manager/product/:productID
    async productDetail(req, res, next) {
        if (req.session.manager) {
            const productID = req.params.productID;
            const manager = req.session.manager;
            const product = await db.getProductDetail2(manager.at(0).MaCN, productID);
            const discount = await db.getDiscount2(productID);
            const importHistory = await db.getImportHistory2(manager.at(0).MaCN, productID);
            var today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;

            if (!product.at(0).SLBan) {
                product.at(0).SLBan = 0;
            }

            if (discount) {
                discount.at(0).Giam = discount.at(0).Giam * product.at(0).GiaBan;
            }

            res.render('./Manager/productDetail', {
                layout: 'ManagerLayout',
                title: 'Sản phẩm',
                manager: manager,
                product: product,
                history: importHistory,
                discount: discount,
                today: today,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[POST]/manager/updateQuantity
    async updateQuantity(req, res) {
        if (req.session.manager) {
            const productID = req.body.productID;
            const branchID = req.body.branchID;
            const date = req.body.date;
            const quantity = req.body.quantity;
            const update = await db.updateQuantity(branchID, productID, date, quantity);
            const url = '/manager/products/' + productID;
            setTimeout(() => { console.log("Running!"); }, 1000);
            res.redirect(url);
            return;
        }
        res.redirect('/sign-in');
    }



    //[GET]/manager/warehouse
    async warehouseEntryHistory(req, res) {
        if (req.session.manager) {
            const manager = req.session.manager;
            let batch;
            if (req.query.batch) {
                batch = req.query.batch;
            }
            else {
                batch = 0;
            }
            if (batch < 0) {
                batch = 0;
            }
            const batchID = await db.getBatchID(manager.at(0).MaCN, batch);

            const importHistory = await db.getImportHistory3(batchID.at(0).MaDot);
            var value = 0;
            importHistory.forEach(element => {
                value = value + element.GIATRI;
            });

            res.render('./Manager/warehouse', {
                layout: 'ManagerLayout',
                title: 'Quản lý kho',
                manager: manager,
                batch: batch,
                batchID: batchID,
                value: value,
                history: importHistory,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/manager/orders
    async allOrders(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
            const page = parseInt(req.query.page) || 1;
            const numberOfPage = await db.getNumberOfPageOrders(manager.at(0).MaCN);

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
            const ordersList = await db.getAllOrdersBranch(page,manager.at(0).MaCN);
            ordersList.forEach(order => {
                if (order.TinhTrang == 0) {
                    order.TinhTrang = 'Chưa gửi hàng';
                }
                else if (order.TinhTrang == 1) {
                    order.TinhTrang = 'Đang gửi hàng';
                }
                else {
                    order.TinhTrang = 'Đã thanh toán';
                }
            });

            res.render('./Manager/orders', {
                layout: 'ManagerLayout',
                title: 'Đơn hàng',
                manager: manager,
                page: page,
                numberOfPage: numberOfPage,
                pageList: pageList,
                orders: ordersList,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/manager/orders/:orderID
    async orderDetail(req, res, next) {
        if (req.session.manager) {
            const orderID = req.params.orderID;
            const manager = req.session.manager;
            const orderDetail = await db.getOrderDetail(orderID);
            const orderList = await db.getOrderList(orderID);
            const status = orderDetail.at(0).TinhTrang;
            if (orderDetail.at(0).TinhTrang == -1) {
                orderDetail.at(0).TinhTrang  = 'Đã huỷ đơn';
            }
            else if (orderDetail.at(0).TinhTrang == 0) {
                orderDetail.at(0).TinhTrang  = 'Chưa gửi hàng';
            }           
            else if (orderDetail.at(0).TinhTrang  == 1) {
                orderDetail.at(0).TinhTrang  = 'Đang gửi hàng';
            }
            else if (orderDetail.at(0).TinhTrang  == 2) {
                orderDetail.at(0).TinhTrang  = 'Đã thanh toán';
            }     

            res.render('./Manager/orderDetail', {
                layout: 'ManagerLayout',
                title: 'Chi tiết hoá đơn',
                manager: manager,
                orderDetail: orderDetail,
                orderList: orderList,
                status: status,
                cssP: () => 'invoice-template',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/manager/sendOrder
    async sendOrder(req, res) {
        if (req.session.manager) {
            const orderID = req.query.orderID;
            const operation = db.sendOrder(orderID);
            res.redirect('/manager/orders');
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/manager/turnover
    async showTurnover(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
            let page;
            if (req.query.page) {
                page = req.query.page;
            }
            else {
                page = 1;
            }
            if (page < 1) {
                page = 1;
            }
            const allTurnover = await db.showTurnoverBranch(page,manager.at(0).MaCN);


            res.render('./Manager/turnover', {
                layout: 'ManagerLayout',
                title: 'Doanh thu',
                manager: manager,
                turnover: allTurnover,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/manager/statistic
    async statistic(req, res) {
        if (req.session.manager) {
            const manager = req.session.manager;
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();

            let page;
            if (req.query.page) {
                page = req.query.page;
            }
            else {
                page = 1;
            }
            if (page < 1) {
                page = 1;
            }
            const allTurnover = await db.showTurnoverBranch(page,manager.at(0).MaCN);
            const bestSeller = await db.getBestSeller3(manager.at(0).MaCN);

            res.render('./Manager/statistic', {
                layout: 'ManagerLayout',
                title: 'Thống kê',
                manager: manager,
                month: month,
                year: year,
                turnover: allTurnover,
                products: bestSeller,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }


    //[GET]/manager/staff
    async staff(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
            const staffList = await db.getAllStaffBranch(manager.at(0).MaCN);

            res.render('./Manager/staff', {
                layout: 'ManagerLayout',
                title: 'Nhân viên',
                manager: manager,
                staff: staffList,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/manager/staff/staffID
    async staffDetail(req, res, next) {
        if (req.session.manager) {
            const manager = req.session.manager;
            const staffID = req.params.staffID;
            const staff = await db.getStaffDetail(staffID);
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


            res.render('./Manager/staffDetail', {
                layout: 'ManagerLayout',
                title: 'Nhân viên',
                manager: manager,
                staff: staff,
                salaryHistory: salaryHistory,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
            return;
        }
        res.redirect('/sign-in');
    }
}

module.exports = new ManagerController;