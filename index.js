var express= require('express');
var app = express();
var logger = require('morgan');
var expressku = require('./routes/expressku');

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('Server is running on port ' + app.get('port'));
});

app.get('/express', expressku.home);

app.listen(app.get('port'), function() {
    console.log('Server is running on port ' + app.get('port'))
});