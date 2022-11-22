const express = require('express');
const app = express();
const path = require('path');
const route = require('./routes/index');
const port = process.env.PORT || 3000;;
const handlebars = require('express-handlebars');
const sql = require('mssql/msnodesqlv8');
const session = require('express-session');


const hbs = handlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        ifStr(s1, s2, options) {
            if (s1 === s2) {
                return options.fn(this)
            }
            return options.inverse(this)
        },

        eq(s1,s2,option){
            if(s1==s2){
                return option.fn(this)
            }
            return option.inverse(this)
        },

        dif(s1,s2,option){
            if(s1==s2){
                return option.inverse(this)
            }           
            return option.fn(this);
        },

        sum(s1,s2){
            return parseInt(s1)+parseInt(s2);
        },

        sub(s1,s2){
            return parseInt(s1)-parseInt(s2);
        },

    }
})


//app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());



//Init routes
route(app);

app.listen(port, () => {
    
    console.log(`App listening at http://localhost:${port}`)
})
