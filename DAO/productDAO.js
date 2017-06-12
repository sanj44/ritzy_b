'use strict';

var Models = require('../Models/Product');

var updateProduct = function(criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Insert Product in DB
var createProduct= function(objToSave, callback) {
    new Models(objToSave).save(callback)
};
//Delete User in DB
var deleteProduct = function(criteria, callback) {
    Models.findOneAndRemove(criteria, callback);
};

//Get Users from DB
var getProduct = function(criteria, projection, options, callback) {
    options.lean = true;
    Models.find(criteria, projection, options, callback);
};

module.exports = {
    updateProduct: updateProduct,
    createProduct: createProduct,
    deleteProduct: deleteProduct,
    getProduct: getProduct
}
