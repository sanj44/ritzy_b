var mongoose = require('mongoose');
mongoose.set('debug', true);
var config = require("../Utilities/config").config;

module.exports = function() {
    //mongoose.Promise = global.Promise;
    /*var db = mongoose.connect(config.DB_URL.url);*/
    var db = mongoose.connect("mongodb://sanj44:sanj1234@ds163681.mlab.com:63681/ecom");
    require('../Models/Product');
    return db;
};
