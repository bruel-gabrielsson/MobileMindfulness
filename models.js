
var Mongoose = require('mongoose');

var breathingSchema = new Mongoose.Schema({
    date: Date,
    data: Object,
    _user: { type: Mongoose.Schema.ObjectId, ref: 'User' },
    username: String
  });

exports.BreathingSession = Mongoose.model('BreathingSession', breathingSchema);
