
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var passport  = require ('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('express-session');



var app = express();



//database configuration
mongoose.connect('mongodb://prithwiC:Pangolin999(@ds129281.mlab.com:29281/contactlist', function(err){
  if(!err) {
    console.log("Connected to Contactlist database.");
  }else{
    console.log(err.message);
  }

});

//

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade'); 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/app'));
//app.use(express.static(__dirname + '/public/app/images'));
app.use(express.static(__dirname + '/public/bower_components'));
//app.use('/', express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, '/public/bower_components')));


app.use(cookieParser());





var routes = require('./routes/contacts');
var users = require('./routes/users');
require('./routes/passport')(app,passport);

app.use('/api', routes);
app.use('/api', users);




app.get('*' , function(req,res){

  return res.sendFile(__dirname+'/public/app/index.html');
});

var port = process.env.PORT || 3000;
app.listen(port,function(err){
  if(!err)
    console.log("Server running at port 3000");

});
/*
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
*/
module.exports = app;

  

