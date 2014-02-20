var models = require('../models');

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
}

exports.save = function(User) {
	return function(req, res) {
    //res.redirect('/index');
    	var form_data = req.body;
  		console.log(form_data);

	    var username = req.session.username;
	    if (username != null) {
	    	console.log(username);

	    	User.find({ name: username }, function(error, result) {
		      if (error) res.redirect('/');

		      if (result.length == 0) { 
		      } else {
		        console.log(result[0]);
		        var usr = result[0];
		        var data = usr.breathingSessions;
		        console.log(data);

            console.log("FORMDATA", form_data.data);

            var newBreathingsession = new models.BreathingSession({
              "date": new Date(),
              "data": form_data.data
            });
            newBreathingsession.save(function(err) {if (err) {console.log(err)}});
            data.push(newBreathingsession.id);
            usr.breathingSessions.push(newBreathingsession);
            usr.save(afterSaving);            

            function afterSaving(err) {
              if (err) {console.log(err); res.send(500)}

              var id = usr.breathingSessions[usr.breathingSessions.length - 1];
              console.log("FINAL", usr.breathingSessions[usr.breathingSessions.length - 1]);
              
              models.BreathingSession.find({ _id: id }, function(error, result) {
                if (error) {console.log(error)};
                console.log(result);

                res.send(200);
              });
              
            }
		      }
		    });
	    }

	};
  

  /*
  // make a new Project and save it to the DB
  // YOU MUST send an OK response w/ res.send();
  var newProject = new models.Project({
    "title": form_data.project_title,
    "date": new Date(form_data.date),
    "summary": form_data.summary,
    "image": form_data.image_url
  });
  newProject.save(afterSaving);

  function afterSaving(err) {
    if (err) {console.log(err); res.send(500)}
    res.redirect("/");
  }
  */
}


exports.history = function(User) {
  return function(req, res) {

      var username = req.session.username;
      if (username != null) {
        console.log(username);

        User.find({ name: username }, function(error, result) {
          if (error) res.redirect('/');

          if (result.length == 0) { 
          } else {
            console.log(result[0]);
            var usr = result[0];
            var data = usr.breathingSessions;
            console.log(data);

            console.log("FORMDATA", form_data.data);

            var newBreathingsession = new models.BreathingSession({
              "date": new Date(),
              "data": form_data.data
            });
            newBreathingsession.save(function(err) {if (err) {console.log(err)}});
            data.push(newBreathingsession.id);
            usr.breathingSessions.push(newBreathingsession);
            usr.save(afterSaving);            

            function afterSaving(err) {
              if (err) {console.log(err); res.send(500)}

              var id = usr.breathingSessions[usr.breathingSessions.length - 1];
              console.log("FINAL", usr.breathingSessions[usr.breathingSessions.length - 1]);
              
              models.BreathingSession.find({ _id: id }, function(error, result) {
                if (error) {console.log(error)};
                console.log(result);

                res.send(200);
              });
              
            }
          }
        });
      }

  };
}


