// Get all of our friend data
//var data = require('../data.json');

exports.view = function(req, res){
	console.log("Index");
	res.render('index', {
    title: 'MobileMindfulness',
    username: req.session.username
  });

};