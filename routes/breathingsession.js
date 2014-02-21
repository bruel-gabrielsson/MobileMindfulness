var models = require('../models');

exports.list = function(User){
  return function(req, res) {

    User.find().lean().exec(function (err, users) {
      return res.render('userlist', {
        "userlist" : users
      });
    });

  };
}

exports.save = function(User) {
	return function(req, res) {
    	var form_data = req.body;

	    var username = req.session.username;
	    if (username) {
	    	User.find({ name: username }, function(error, result) {
		      if (error) res.redirect('/');

		      if (result.length == 0) {
		      } else {
		        var usr = result[0];

            var newBreathingsession = new models.BreathingSession({
              "date": new Date(),
              "data": form_data.data,
              "_user": usr.id,
              "username": usr.name
            });
            newBreathingsession.save(function(err) {if (err) {console.log(err)}});

            res.send(200);
		      }
		    });
	    } else {
        res.json({message:'You have to be logged in to save your results.</br><a href="./">Register here!</a>'});
      }
	};
}


exports.history = function(User) {
  return function(req, res) {
      var username = req.session.username;
      if (username != null) {
        models.BreathingSession.find({username: username.toString()}).sort([['date','ascending']]).exec(function(error, result) {
          if (error) res.redirect('/');
          res.json(result);
        });
      } else {
        res.json({message:'You have to be logged in to see your progress.</br><a href="./">Register here!</a>'});
      }
  };
}


