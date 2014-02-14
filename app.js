
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
// Example route
// var user = require('./routes/user');

var app = express();


var databaseUrl = "mongodb://localhost:27017/mydb"; // "username:password@example.com/mydb"
var collections = ["users", "data"]
var db = require("mongojs").connect(databaseUrl, collections);

db.users.save({username: "Rickard", password: "pass"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

db.users.save({username: "Mathan", password: "pass"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

//console.log(db.users.find().count());

//db.users.find().forEach( function(myDoc) { print( "user: " + myDoc.name ); } );

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
app.get('/', login.view);

// LOGIN
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
