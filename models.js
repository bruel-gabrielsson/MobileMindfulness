
var Mongoose = require('mongoose');

var breathingSchema = new Mongoose.Schema({
    date: Date,
    data: Object
  });

exports.BreathingSession = Mongoose.model('BreathingSession', breathingSchema);
