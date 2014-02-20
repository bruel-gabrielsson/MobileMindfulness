
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
      console.log(JSON.stringify(users));
    });

  };
  
};


exports.login = function(User) {
  return function(req, res) {
    // remember the username
    var username = req.query.userid;
    var password = req.query.passwordinput.toString();
    console.log('username is: '+ username + password);

    User.find({ name: username }, function(error, result) {
      if (error) res.redirect('/');

      if (result.length == 0) { 
        res.render('user_error', {
          error: "No such username, please try again"
        }); 
      } else {
        console.log(result[0]);
        var usr = result[0];

        var pass = usr.password;
        console.log(pass, password);
        if (pass === password) {
          // send them back to the homepage
          req.session.username = username;
          res.redirect('/index');

        } else {
          res.render('user_error', {
            error: "Username and password did not match, please try again or register"
          }); 
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

        newUsr.save(function (err, Rickard) {
          if (err) {
            console.log("error");
          } else {  
            console.log("success save");
            req.session.username = username;
            res.redirect('/index');
          }
        });
      } else { // Username taken
        res.render('user_error', {
          error: "Username taken, please try again"
        });  
      }
    });
  } 
}


exports.logout = function(req, res) {
  req.session.username = null;

  res.redirect('/');
}