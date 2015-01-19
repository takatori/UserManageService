var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');

var config = require('./config');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect'});
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');

// set the 'dbUrl' to the mongodb url that corresponds to the
// environment we are in
app.set('dbUrl', config.db[app.settings.env]);
// connect mongoose to the mongo dbUrl
mongoose.connect(app.get('dbUrl'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000);
module.exports = app;

