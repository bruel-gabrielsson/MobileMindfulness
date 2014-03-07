
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var passport = require('passport');

handlebars.partialsDir = "views/partials/";

var index = require('./routes/index');
var login = require('./routes/login');
var user = require('./routes/user');
var experiment = require('./routes/experiment');
var breathingsession = require('./routes/breathingsession');
// Example route
// var user = require('./routes/user');

var app = express();

/*
var databaseUrl = "mongodb://localhost:27017/mydb"; // "username:password@example.com/mydb"
var collections = ["users", "data"];
var db = require("mongojs").connect(databaseUrl, collections);
*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/index', index.view);
app.get('/guidance', index.viewGuidance);
app.get('/experiment', experiment.view);
app.get('/', login.view);

// LOGIN
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
// Example route
// app.get('/users', user.list);

/******* OLD
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://localhost:27017/mydb');
*/

var mongoose = require ("mongoose"); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost:27017/mydb';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  var userSchema = mongoose.Schema({
    name: String,
    password: String,
    breathingSessions: [{type: mongoose.Schema.ObjectId, ref: 'BreathingSession'}]
  });

  var User = mongoose.model('User', userSchema);

  app.get('/user_login', user.login(User));
  app.get('/user_logout', user.logout);
  app.get('/users', user.list(User));
  app.get('/user_register', user.register(User));
  
  app.post('/breathingsession/new', breathingsession.save(User));
  app.get('/breathingsession/history', breathingsession.history(User));
  app.get('/breathingsession/experiment', breathingsession.experiment(User));

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
