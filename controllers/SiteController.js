
const db = require('../models/dbOperations');

class SiteController {
    //[GET]/
    home(req, res, next) {
        let page;
        if(req.query.page){
            page=req.query.page;
        }
        else{
            page = 1;
        }
        if(page<1){
            page=1;
        }
        db.getProducts(page).then((data) => {
            //res.json(data);
            //console.log(data);
            if (req.session.user) {

                res.render('home', {
                    title: 'Trang chủ',
                    user: req.session.user,
                    numberOfProduct: req.session.cart.length,
                    products: data,
                    page: page,
                    cssP: () => 'css',
                    scriptP: () => 'script',
                    navP: () => 'navCustomer',
                    footerP: () => 'footer',
                });
                return;
            }
            res.render('home', {
                title: 'Trang chủ',
                products: data,
                page: page,
                cssP: () => 'css',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })
        })
    }

    //[GET]/cart
    async cart(req, res, next) {
        if (req.session.user) {
            const branch = await db.getAllBranch();
            res.render('cart', {
                title: 'Giỏ hàng',
                user: req.session.user,
                numberOfProduct: req.session.cart.length,
                products: req.session.cart,
                grandTotal: req.session.grandTotal,
                branch: branch,
                cssP: () => 'cartStyle',
                scriptP: () => 'script',
                navP: () => 'navCustomer',
                footerP: () => 'footer',
            });
            return;
        }
        res.render('cart', {
            title: 'Giỏ hàng',
            cssP: () => 'css',
            scriptP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
        })
    }

    //[GET]/sign-up
    signup(req, res, next) {
        res.render('sign-up', {
            title: 'Đăng ký',
            cssP: () => 'accountStyle',
            scriptP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
        })
    }

    //[GET]/sign-in
    singin(req, res, next) {
        res.render('sign-in', {
            title: 'Đăng nhập',
            cssP: () => 'accountStyle',
            scriptP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
        })
    }

    //[GET]/log-out
    logout(req, res, next) {
        if (req.session.user) req.session.destroy();
        res.redirect('/')
    }

    //[POST]/addCustomer
    async addCustomer(req, res, next) {
        const name = req.body.name;
        const address = req.body.address;
        const phone = req.body.phone;
        const success = await db.addNewUser(name, address, phone);
        if (success == 0) {
            console.log('Tài khoản đã tồn tại');
            res.send('Tài khoản đã tồn tại');
            return;
        }
        else {
            const user = await db.verifyCustomer(phone);
            req.session.user = user;
            req.session.cart = [];
            req.session.grandTotal = 0;
            res.redirect('/');
            return;
        }

    }

    //[POST]/verifyCustomer
    async verifyCustomer(req, res, next) {
        const phone = req.body.phone;
        const user = await db.verifyCustomer(phone);
        if (user) {
            console.log('Đăng nhập thành công');
            req.session.user = user;
            req.session.cart = [];
            req.session.grandTotal = 0;
            res.redirect('/');
            return;
        }
        res.send('SĐT này chưa được đăng ký');
        return;
    }

    //POST/verifyStaff
    async verifyStaff(req, res, next) {
        const phone = req.body.phone;
        const staff = await db.verifyStaff(phone);
        if (staff) {
            console.log('Đăng nhập thành công');
            
            if (staff.at(0).LoaiNhanVien == 0) {
                console.log('Nhân viên bán hàng');
                req.session.staff = staff;
                res.send(staff.at(0).TenNV);
                return;
            }

            if (staff.at(0).LoaiNhanVien == 1) {
                console.log('Quản lý chi nhánh');            
                req.session.manager = staff;
                res.redirect('/manager');
                return;
            }

            if (staff.at(0).LoaiNhanVien == 2) {
                console.log('Admin');
                req.session.admin = staff;
                res.redirect('/admin');
                return;
            }

        }
        res.send('SĐT này chưa được đăng ký');
        return;
    }

    //[GET]/search?q=...
    async search(req, res, next) {
        const q = req.query.q;
        const products = await db.search(q);
        if (products) {
            if (req.session.user) {
                res.render('home', {
                    title: 'Tìm kiếm: ' + q,
                    products: products,
                    user: req.session.user,
                    numberOfProduct: req.session.cart.length,
                    cssP: () => 'css',
                    scriptP: () => 'script',
                    navP: () => 'navCustomer',
                    footerP: () => 'footer',
                })
                return;
            }
            res.render('home', {
                title: 'Tìm kiếm: ' + q,
                products: products,
                cssP: () => 'css',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })
        }
        else {
            res.send('Không tìm thấy sản phẩm');
        }

    }

    //[GET]/addToCart?productID=...&quantity=...
    async addToCart(req, res, next) {
        if (req.session.user) {
            const product = await db.getProduct(req.query.productID);

            const q = req.query.q;
            for (var i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].productID == product.at(0).MaSP) {
                    res.redirect('/');
                    return;
                }
            }
            var discountRate = await db.getDiscount(req.query.productID);
            if (discountRate) discountRate = discountRate.at(0).Giam;
            else discountRate = 0;
            const discount = discountRate * product.at(0).GiaBan;
            const total = (product.at(0).GiaBan - discount) * parseInt(q);

            req.session.cart.push({
                productName: product.at(0).TenSP,
                productID: product.at(0).MaSP,
                cost: product.at(0).GiaBan,
                discount: discount,
                quantity: q,
                total: total,
            });

            req.session.grandTotal = req.session.grandTotal + total;

            res.redirect('/');
            // console.log('---------------------------------');
            // console.log(req.session.cart);
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/removerFromCart?productID = ...
    async removeFromCart(req, res, next) {
        if (req.session.user) {
            const productID = req.query.productID;
            for (var i = 0; i < req.session.cart.length; i++) {
                if (req.session.cart[i].productID == productID) {
                    req.session.grandTotal = req.session.grandTotal - req.session.cart[i].total;
                    req.session.cart.splice(i, 1);
                    res.redirect('/cart');
                    return;
                }
            }


            res.redirect('/');
            return;
        }
        res.redirect('/sign-in');
    }

    //[POST]/addToOrder
    async addToOrder(req, res, next) {
        if (req.session.user) {
            const address = req.body.address;
            const grandTotal = req.session.grandTotal;
            const customerID = req.session.user.at(0).MaKH;
            const branch = req.body.branch;
            const orderID = await db.addToOrder(customerID, address, grandTotal, branch, null);

            var success;
            if(req.session.cart.length==0){
                res.send('Chưa có sản phẩm nào trong giỏ hàng');
                return;
            }
            req.session.cart.forEach(async product => {
                success = await db.addOrderDetail(orderID, customerID, product.productID , branch, product.cost, product.discount, product.quantity, product.total);
            });
            

            req.session.cart = [];
            req.session.grandTotal = 0;
            res.redirect('/');
            return;
        }
        res.redirect('/sign-in');
    }

    //[GET]/history
    history(req, res, next) {
        if (req.session.user) {
            db.showHistory(req.session.user.at(0).MaKH).then((data) => {
                res.render('history', {
                    title: 'Lịch sử mua sắm',
                    user: req.session.user,
                    numberOfProduct: req.session.cart.length,
                    products: data,
                    cssP: () => 'css',
                    scriptP: () => 'script',
                    navP: () => 'navCustomer',
                    footerP: () => 'footer',
                });
            });
            return;
        }
        res.redirect('/sign-in');
    }

    profile(req, res, next) {
        if (req.session.user) {
            res.render('profile', {
                title: 'Thông tin cá nhân',
                user: req.session.user,
                numberOfProduct: req.session.cart.length,
                cssP: () => 'invoice-template',
                scriptP: () => 'script',
                navP: () => 'navCustomer',
                footerP: () => 'footer',
            });
            return;
        }
        res.redirect('/sign-in');
    }
}

module.exports = new SiteController;
