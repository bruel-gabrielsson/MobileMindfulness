// Get all of our friend data
//var data = require('../data.json');

exports.view = function(req, res){
	console.log("Index");
	res.render('index', {
    	title: 'MobileMindfulness',
    	guidance: false,
    	username: req.session.username
	});
};

exports.viewGuidance = function(req, res){
	console.log("Index");
	res.render('index', {
		title: 'MobileMindfulness',
		guidance: true,
		username: req.session.username
	});
};