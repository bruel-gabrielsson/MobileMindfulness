
/*
 * GET users listing.
 */
 /*
var databaseUrl = "mongodb://localhost:27017/mydb"; // "username:password@example.com/mydb"
var collections = ["users", "data"];
var db = require("mongojs").connect(databaseUrl, collections);
*/

exports.list = function(User){
  return function(req, res) {
    //res.redirect('/index');

    User.find().lean().exec(function (err, users) {
      return res.render('userlist', {
        "userlist" : users
      });
    });

  };
  
};


exports.login = function(User) {
  return function(req, res) {
    // remember the username
    var username = req.query.userid;
    var password = req.query.passwordinput.toString();

    User.find({ name: username }, function(error, result) {
      if (error) res.redirect('/');

      if (result.length == 0) { 
        res.render('login', {message: "No such username, please try again"});
        //res.render('user_error', {
        //  error: "No such username, please try again"
        //}); 
      } else {
        var usr = result[0];

        var pass = usr.password;
        if (pass === password) {
          // send them back to the homepage
          req.session.username = username;
          res.redirect('/index');

        } else {
          res.render('login', {message: "Username and password did not match, please try again or register"});
          //res.render('user_error', {
          //  error: "Username and password did not match, please try again or register"
          //}); 
        }

      }
    });
    

    
  };
};

exports.register = function(User) {
  return function(req, res) {
    // remember the username
    var username = req.query.userid;
    var password = req.query.passwordinput;

    User.find({ name: username }, function(error, result) {
      if (error) res.redirect('/');

      if (result.length == 0) { // No such user exists 
        var newUsr = new User({ name: username, password: password});

        newUsr.save(function (err) {
          if (err) {
            console.log("error");
          } else {  
            req.session.username = username;
            res.redirect('/index');
          }
        });
      } else { // Username taken
        res.render('login', {message: "Username taken, please try again"});
        //res.render('user_error', {
        //  error: "Username taken, please try again"
        //});  
      }
    });
  } 
}


exports.logout = function(req, res) {
  req.session.username = null;

  res.redirect('/');
}