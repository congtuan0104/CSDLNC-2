//const Product = require('../models/products');
const db = require('../models/dbOperations');

class ProductsController {
    //[GET]/products
    home(req, res, next) {
        db.get10Products().then((data) => {
            if (req.session.user) {
                res.render('home', {
                    title: 'Sản phẩm',
                    user: req.session.user,
                    products: data,
                    cssP: () => 'css',
                    scriptP: () => 'script',
                    navP: () => 'navCustomer',
                    footerP: () => 'footer',
                });
                return;
            }

            res.render('home', {
                title: 'Sản phẩm',
                products: data,
                cssP: () => 'css',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })
        })
    }

    //[GET]/products/:productID
    detail(req, res, next) {
        db.getProductDetail(req.params.masp).then((data) => {
            if (req.session.user) {
                res.render('product-detail', {
                    title: data.at(0).TenSP,
                    product: data,
                    user: req.session.user,
                    cssP: () => 'product-style',
                    scriptP: () => 'script',
                    navP: () => 'navCustomer',
                    footerP: () => 'footer',
                })
                return;
            }

            res.render('product-detail', {
                title: data.at(0).TenSP,
                product: data,
                cssP: () => 'product-style',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })
        })
    }
}

module.exports = new ProductsController;
