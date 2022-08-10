var express= require('express');
var app = express();
var logger = require('morgan');
var path = require ('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');

var expressku = require('./routes/expressku');
var adminku = require('./routes/adminku');

var conn = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use('/public',express.static(__dirname + '/public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.use(
    conn(mysql, {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306,
        database: 'express_db'
    }, 'single')
);

app.use(
    session({
        secret: 'babastudio',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 120000}
    })
);

app.get('/', function (req, res) {
    res.send('Server is running on port ' + app.get('port'));
});

app.get('//express/admin/add_news', function (req, res) {
    console.log("body: " , req.body);
    res.json(req.body);
});


app.get('/express', expressku.home);
app.get('/express/news', expressku.news);
app.get('/express/news_detail/:id_news', expressku.news_detail);
app.get('/express/about', expressku.about);
app.get('/express/contact', expressku.contact);
app.get('/express/gallery', expressku.gallery);

app.get('/express/admin', adminku.login);
app.post('/express/admin/login', adminku.login);
app.get('/express/admin/login', adminku.login);
app.get('/express/admin/home', adminku.home);
app.get('/express/admin/add_news', adminku.add_news);
app.post('/express/admin/add_news', adminku.process_add_news);
app.get('/express/admin/edit_news/:id_news', adminku.edit_news);
app.post('/express/admin/edit_news/:id_news', adminku.process_edit_news);
app.get('/express/admin/delete_news/:id_news', adminku.delete_news);
app.get('/express/admin/logout', adminku.logout);

app.listen(app.get('port'), function() {
    console.log('Server is running on port ' + app.get('port'))
});