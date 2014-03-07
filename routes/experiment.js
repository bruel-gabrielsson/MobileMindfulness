// Get all of our friend data
//var data = require('../data.json');

exports.view = function(req, res){
	console.log("Experiment");
	res.render('experiment', {
    	title: 'MobileMindfulness',
    	username: req.session.username
	});
};