var express= require('express');
var app = express();
var logger = require('morgan');
var expressku = require('./routes/expressku');
var conn = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/public',express.static(__dirname + '/public'));

app.use(
    conn(mysql, {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306,
        database: 'express_db'
    }, 'single')
);

app.get('/', function (req, res) {
    res.send('Server is running on port ' + app.get('port'));
});

app.get('/express', expressku.home);
app.get('/express/news', expressku.news);
app.get('/express/about', expressku.about);
app.get('/express/contact', expressku.contact);
app.get('/express/gallery', expressku.gallery);

app.listen(app.get('port'), function() {
    console.log('Server is running on port ' + app.get('port'))
});