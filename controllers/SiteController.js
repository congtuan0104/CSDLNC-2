
const Product = require('../models/products');
const db = require('../models/dbOperations');

class SiteController {
    //[GET]/
    home(req, res, next) {
        
        db.get10Products().then((data) =>{
            //res.json(data);
            //console.log(data);
            res.render('home', {
                title: 'Trang chủ',
                products: data,
                cssP: () => 'css',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })
        })
        
    }

    index(req,res){
        
    }

}

module.exports = new SiteController;
