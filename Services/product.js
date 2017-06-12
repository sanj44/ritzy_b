let async = require('async'),
    parseString = require('xml2js').parseString;

let templates = require('../Utilities/templates'),
    util = require('../Utilities/util'),
    config = require("../Utilities/config").config;
let productDAO = require('../DAO/productDAO');

let addNewProduct = (files,data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
           if (!data.body.productId) {
                cb(null, { "errorCode": util.hathwayErrorCode.ONE, "errorMessage": util.hathwayErrorMessage.PARAMS_MISSING })
                return;
            } 

            var inr = {
                stock_cost : data.body.inr_stock_cost?data.body.inr_stock_cost:"",
                mrp : data.body.inr_mrp?data.body.inr_mrp:"",
                on_sale : data.body.inr_on_sale?data.body.inr_on_sale:"",
                sale_price : data.body.inr_sale_price?data.body.inr_sale_price:"",
                start_date : data.body.inr_start_date?data.body.inr_start_date:"",
                end_date : data.body.inr_start_date?data.body.inr_start_date:"",
            }
            /*var usd = {
                stock_cost : data.body.usd_stock_cost?data.body.usd_stock_cost:"",
                mrp : data.body.usd_mrp?data.body.usd_mrp:"",
                on_sale : data.body.usd_on_sale?data.body.usd_on_sale:"",
                sale_price : data.body.inr_sale_price?data.body.inr_sale_price:"",
                start_date : data.body.inr_start_date?data.body.inr_start_date:"",
                end_date : data.body.inr_start_date?data.body.inr_start_date:"",
            }*/
			
			
			
			console.log(files); 
			console.log("sanjeet"); 
			console.log(data.body);
            console.log("sanjeet");			
             var productData = {
                productId: data.body.productId,
                categoryId: data.body.categoryId,
                productName: data.body.productName,
                clothingType: data.body.clothingType,
                productDesc: data.body.productDesc,
                colorAvailability: data.body.colorAvailability,
                sizeAvailability: data.body.sizeAvailability,
                dateAvailabilityFrom: data.body.dateAvailabilityFrom,
                productDetail: data.body.productDetail,
                kerywords: data.body.kerywords,
				image1: files.image1[0].filename,
                image2: files.image2[0].filename,
                image3: files.image3[0].filename,
                image4: files.image4[0].filename,
                image5: files.image5[0].filename,
                image6: files.image6[0].filename,
                stock_available : data.body.stock_available,
                stock_ordered: data.body.stock_ordered,
                inr : inr,
                status:true

            }            
            /*
,
                usd : usd,
                euro : euro,
                sgd : sgd,
                aud,aud            */
            productDAO.createProduct(productData, (err, dbData) => {
                if (err) {
                    console.error(err);
                    cb(null, { "errorCode": util.hathwayErrorCode.ONE, "errorMessage": util.hathwayErrorMessage.DB_ERROR })
                    return;
                }

                console.log(err, dbData);
                callback({ "Response": util.hathwayErrorCode.ZERO, "success": "Product added successfully." })
                return;

            });            
            /*customerDAO.getCustomer(criteria, {}, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "errorCode": util.hathwayErrorCode.ONE, "errorMessage": util.hathwayErrorMessage.SERVER_BUSY })
                    return;
                }

                if (dbData && dbData.length) {
                    cb(null, { "customerID": dbData[0]["customerID"], "poID": dbData[0]["poID"] });
                } else {
                    cb(null, { "errorCode": util.hathwayErrorCode.NINE, "errorMessage": util.hathwayErrorMessage.CUSTOMERID_NOT_REGISTERED });
                }
            });*/
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    });
}


let productList = (data, callback) => {
/*if (!data.body.token) {
                callback({ "errorCode": util.hathwayErrorCode.ONE, "errorMessage": util.hathwayErrorMessage.PARAMS_MISSING })
                return;
            } */
    async.auto({
                  
            getProducts: (cb) => {
                          
            var criteria = {
                status: true
            }
            productDAO.getProduct(criteria, {}, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "errorCode": util.hathwayErrorCode.ONE, "errorMessage": util.hathwayErrorMessage.SERVER_BUSY })
                    return;
                }

                if (dbData && dbData.length) {
                    cb(null, { "errorCode": util.hathwayErrorCode.ZERO, "result": dbData});
                } else {
                    cb(null, { "errorCode": util.hathwayErrorCode.NINE, "errorMessage": util.hathwayErrorMessage.NO_BEST_PLAN });
                }
            });
        }
    }, (err, response) => {
        callback(response.getProducts);
    });
}


module.exports = {
    addNewProduct: addNewProduct,
    productList:productList,
};
