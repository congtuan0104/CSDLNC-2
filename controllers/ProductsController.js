const db = require('../models/dbOperations');

class ProductsController {
    //[GET]/products
    home(req, res, next) {
        res.redirect('/');
    }

    //[GET]/products/:productID
    async detail (req, res, next) {
        const discount = await db.getDiscount(req.params.productID);
        
        db.getProductDetail(req.params.productID).then((data) => {
            if(discount) discount.at(0).Giam = data.at(0).GiaBan * discount.at(0).Giam;

            if (req.session.user) {
                res.render('product-detail', {
                    title: data.at(0).TenSP,
                    product: data,
                    discount: discount,
                    user: req.session.user,
                    numberOfProduct: req.session.cart.length,
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
                discount: discount,
                cssP: () => 'product-style',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })

        })
    }
}

module.exports = new ProductsController;
