const express = require('express');
const app = express();
const path = require('path');
const route = require('./routes/index');
const port = 3000;
const handlebars = require('express-handlebars');
const sql = require('mssql/msnodesqlv8');
//const db = require('./models/dbConfig');
//const db = require('./models/dbOperations');


const hbs = handlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        ifStr(s1, s2, option) {
            if (s1 === s2) {
                return options.fn(this)
            }
            return options.inverse(this)
        }
    }
})

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
