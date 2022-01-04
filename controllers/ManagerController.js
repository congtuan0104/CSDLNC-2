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
            const url= '/manager/products/'+ productID;  
            setTimeout(() => {  console.log("Running!"); }, 1000);
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
            var value=0;
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
            const ordersList = await db.getAllOrders(page);
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
                orders: ordersList,
                cssP: () => 'css',
                scriptP: () => 'script',
            });
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
            const allTurnover = await db.showTurnover(page);


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
            const allTurnover = await db.showTurnover(page);
            const bestSeller = await db.getBestSeller2();

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
}

module.exports = new ManagerController;