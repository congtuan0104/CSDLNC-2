
const Product = require('../models/products');
const db = require('../models/dbOperations');

class SiteController {
    //[GET]/
    home(req, res, next) {
        
        db.get10Products().then((data) =>{
            //res.json(data);
            //console.log(data);
            if(req.session.user){
                
                res.render('home', {
                    title: 'Trang chủ',
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
                title: 'Trang chủ',
                products: data,
                cssP: () => 'css',
                scriptP: () => 'script',
                navP: () => 'nav',
                footerP: () => 'footer',
            })
        })       
    }

    //[GET]/cart
    cart(req,res,next){
        if(req.session.user){      
            res.render('cart', {
                title: 'Giỏ hàng',
                user: req.session.user,
                cssP: () => 'css',
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
    signup(req,res,next){
        res.render('sign-up',{
            title: 'Đăng ký',
            cssP: () => 'accountStyle',
            scriptP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
        })
    }

    //[GET]/sign-in
    singin(req,res,next){
        res.render('sign-in',{
            title: 'Đăng nhập',
            cssP: () => 'accountStyle',
            scriptP: () => 'script',
            navP: () => 'nav',
            footerP: () => 'footer',
        })
    }

    //[GET]/log-out
    logout(req,res,next){
        if(req.session.user) req.session.destroy();
        res.redirect('/')
    }

    //[POST]/cart
    async addCustomer(req,res,next){
        const name = req.body.name;
        const address = req.body.address;
        const phone = req.body.phone;
        
        await db.addNewUser(name,address,phone);
        //if()
        res.redirect('/');
    }

    //[POST]/verifyCustomer
    async verifyCustomer(req,res,next){
        const phone=req.body.phone;
        const user= await db.verifyCustomer(phone);
        if(user){
            console.log('Đăng nhập thành công');
            req.session.user = user;
            res.redirect('/');
            return;
        }
        res.send('SĐT này chưa được đăng ký');
        return;
    }

    //POST/verifyStaff
    async verifyStaff(req,res,next){
        const phone=req.body.phone;
        const user= await db.verifyStaff(phone);
        if(user){
            console.log('Đăng nhập thành công');
            res.send(user.at(0).TenNV);
            return;
        }
        res.send('SĐT này chưa được đăng ký');
        return;
    }
}

module.exports = new SiteController;
