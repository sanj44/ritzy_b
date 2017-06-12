var mongoose = require('mongoose');
mongoose.set('debug', true);


module.exports = function () {
//	var db = mongoose.connect('mongodb://52.45.250.47:27017/hathway');
    var db = mongoose.connect("mongodb://sanj44:sanj1234@ds163681.mlab.com:63681/ecom");
	require('../Models/Customer');
	require('../Models/Transaction');
	require('../Models/Lead');
	return db;
};
