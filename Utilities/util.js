let nodemailer = require("nodemailer"),
    config = require("./config").config,
    templates = require("./templates"),
    MD5 = require('md5'),
    request = require('request'),
    mustache = require('mustache'),
    bodyParser = require('body-parser'),
    parseString = require('xml2js').parseString;
var querystring = require('querystring');
let cityDetail = require('../Utilities/cityDetail.json');

let AWS = require('aws-sdk'),
    fs = require('fs'),
    async = require('async');

AWS.config.update({
    accessKeyId: config.S3_ACCESS_KEY_ID.id,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY.key,
    region: config.S3_REGION.region
});

let elastictranscoder = new AWS.ElasticTranscoder(),
    s3 = new AWS.S3();


let htmlEnDeCode = (function() {
    var charToEntityRegex,
        entityToCharRegex,
        charToEntity,
        entityToChar;

    function resetCharacterEntities() {
        charToEntity = {};
        entityToChar = {};
        // add the default set
        addCharacterEntities({
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"',
            '&#39;': "'"
        });
    }

    function addCharacterEntities(newEntities) {
        var charKeys = [],
            entityKeys = [],
            key, echar;
        for (key in newEntities) {
            echar = newEntities[key];
            entityToChar[key] = echar;
            charToEntity[echar] = key;
            charKeys.push(echar);
            entityKeys.push(key);
        }
        charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
        entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
    }

    function htmlEncode(value) {
        var htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        };

        return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
    }

    function htmlDecode(value) {
        var htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        };

        return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
    }

    resetCharacterEntities();

    return {
        htmlEncode: htmlEncode,
        htmlDecode: htmlDecode
    };
})();

// Define Error Codes
let hathwayErrorCode = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    FOUR_ZERO_FOUR: 404,
    FIVE_ZERO_ZERO: 500
};

// Define Error Messages
let hathwayErrorMessage = {
    PARAMS_MISSING: 'Mandatory Fields Missing',
    DB_ERROR: 'Database error',
    SERVER_BUSY: 'Our Servers are busy. Please try again later.',
    CUSTOMER_ALREADY_REGISTERED: 'Customer is already registered.',
    CUSTOMER_ID_NOT_EXIST: 'Please Register by selecting the Sign up option.',
    OTP_VERIFY: 'OTP sent to your registered email/mobile, please verify.',
    RESEND_OTP_VERIFY: 'You OTP has been sent to your registered email/mobile number, once received click on Verify.',
    PLEASE_SIGNUP_FIRST: 'Your Customer ID is not Registered, Please Sign up First.',
    CUSTOMERID_NOT_REGISTERED: 'Your Customer Id is not Registered.',
    LOGGED_IN: 'You have sucessfully Logged in',
    ENTER_VALID_CUSTOMERID_PASS: 'Please enter your valid customerID and password.',
    OTP_EXPIRED: 'OTP has already expried, please click on Re-send OTP.',
    NO_RECORD_FOUND: 'No record found.',
    CUSTOMER_REGISTERED_SUCCESSFULLY: 'Customer registered successfully.',
    OTP_VERIFY_SUCCESS: 'OTP verified successfully, Please set new password.',
    OTP_ALREADY_VERIFY: 'OTP already sent to your registered email/mobile, please verify.',
    CUSTOMER_IS_NOT_VALID_HATHWAY: 'Customer is not a valid hathway customer.',
    TRANSACTIONS_SUCCESSFULL: 'Your Transactions is successful',
    NO_PAYMENT_FOUND: 'There are No Transactional Records found, please try again later',
    PLAN_NOT_FOUND: 'Your Plan does not exist, Please get in touch with hathway.',
    PRICE_DETAILS_FOUND: 'Your Pricing details are as follows',
    CUSTOMER_DETAILS_FOUND: 'Congratualtion for successfully Logging into Hathway',
    INVALID_OTP: 'Please enter valid OTP.',
    FORGOT_PASSWORD_CHANGED: 'Your Password has changed successfully.',
    OTP_ALREADY_USED: 'OTP already used. Please proceed to login.',
    NO_BEST_PLAN: 'You are currently on the Most Optimal Plan that we have to offer.',
    HATHWAY_RESPONSE_FAILED: 'Failed to get hathway api response. Try again after sometime.',
    VALID_PARAMETERS: 'Please enter valid parameter.',
    GOT_DISPOSITIONS: 'Your last 6 tickets are mentioned below. To Raise a New Ticket please click on New Service Request',
    NO_DISPOSITIONS: 'There are No Tickets previously Raised Tickets in your account. To Raise a New Ticket Please click on New Service Request',
    GOT_TICKET_TYPE: 'Got Ticket types successfully.',
    GOT_TICKETS: 'Got tickets successfully.',
    TICKET_RAISED: 'Ticket has already for this category.',
    NO_PUSH: 'No Alerts have been sent to your mobile.',
    USER_CREATED: 'Congratulaltions!!Your Registration has been completed Successfully.',
    NEW_USER: 'This a new user for activation.',
    HATHWAY_UNDERDVELOPMENT: '<div style="font-family: trebuchet ms;font-size: 12px;color: #999;"><a href="http://hathway.w3studioz.com:3003/api" target="_BLANK">Hathway Documentation</a></div>',
    INVALID_DATA_HEADER: 'Invalid data in header.', //2
    PAGE_NOT_FOUND: 'Page not found', //404
    INTERNAL_SERVER_ERROR: 'Internal server error.', //500
    SOMETHING_WENT_WRONG: 'Something went wrong.',
    RECORD_FOUND_SUCCESSFULLY: 'Record found successfully.',
    ENTER_PIN: 'Please enter your pincode.',
    SELECT_CITY: 'Please select city.',
    GOT_PUSH_LIST: 'Got push notificaion list successfully.',
    NO_SALES: 'No sales person available for this pincode.'
};

let mailModule = nodemailer.createTransport(config.OTP_EMAIL_CONFIG);


let encryptData = (stringToCrypt) => {
    return MD5(MD5(stringToCrypt));
};

let generateCustomDate = (dateString, type) => {
    let UTCDate = new Date(dateString);
    switch (type) {
        case "YYYY-MM-DD HH:mm:ss":
            //let date = new Date(UTCDate.setTime(UTCDate.getTime() + 19800000));
            let date = new Date(UTCDate.setTime(UTCDate.getTime()));
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

        case "YYYY-MM-DD":
            let date2 = new Date(UTCDate.setTime(UTCDate.getTime() + 0));
            return [date2.getFullYear(), date2.getMonth() + 1, date2.getDate()].join('-');
        case "YYYY-MM-DD2":
            // case to add 5.30 hours to make it indian time & then subtract one sec for billing realted condition by hathway Clayton Mendes Date : 30 Jan 2017
            //let date3 = new Date(UTCDate.setTime(UTCDate.getTime() + 19800000 - 1000));
            let date3 = new Date(UTCDate.setTime(UTCDate.getTime() - 1000));
            return [date3.getFullYear(), date3.getMonth() + 1, date3.getDate()].join('-');
        case "YYYY-MM-DD3": // case to get the time converted in IST format...
            //let date4 = new Date(UTCDate.setTime(UTCDate.getTime() + 19800000));
            let date4 = new Date(UTCDate.setTime(UTCDate.getTime()));
            return [date4.getFullYear(), date4.getMonth() + 1, date4.getDate()].join('-');
        case "YYYY-MM-DD4": // case to get the time converted in IST format...
            let date5 = new Date(UTCDate.setTime(UTCDate.getTime() + 86400000));
            return [date5.getFullYear(), date5.getMonth() + 1, date5.getDate()].join('-');
    }

}

let generateTransactionId = () => {
    return Date.now() + Math.floor(Math.random() * 99999) + 10000;
}

// OAuth2 code
//let authMiddleWare = (req, res, next) => {
//   return function (req, res, next) {
//    if (req.isAuthenticated()) {
//      return next()
//    }
//    res.redirect('/')
//  } 
//}


let getSOAPDataFromHathwayServer = (template, data, cb) => {
    //console.log(mustache.render(template, data));
    request.post({
            url: config.SOAP_SERVER_CONFIG.url,
            body: mustache.render(template, data),
            method: 'POST',
            dataType: 'text',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': config.SOAP_SERVER_CONFIG.soapAction
            }
        },
        (error, response, body) => {
            typeof body == "string" ? body = body.replace(/brm:/g, 'brm')
                .replace(/soapenv:Envelope/g, 'soapenvEnvelope')
                .replace(/soapenv:Body/g, 'soapenvBody')
                .replace(/ns1:opcodeResponse/g, 'ns1opcodeResponse')
                .replace(/ns2:Newuser_App_NotifyResponse/g, 'ns2Newuser_App_NotifyResponse')
                .replace(/opcodeReturn/g, 'opcodeReturn') : "";

            parseString(htmlEnDeCode.htmlDecode(body), (err, result) => {
                console.log(result);
                cb(result);
            });
        });
}

let getRESTDataFromHathwayServer = (data, cb) => {
    // set content-type header and data as json in args parameter 
    if (data.customerID) {
        var customerId = data.customerID;
    } else {
        var customerId = "";
    }

    var args = {
        data: {},
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
    var finalUrl = config.REST_SERVER_CONFIG.url + data.apiName + "?username=AFFLE&credentials=apassw0rd&source=SCMOB&service_type=0&sessionID=ABC2872373737367663";
    switch (data.apiName) {
        case "/createTicket":
            finalUrl += "&disposition_id=" + data.disposition_id + "&remarks=" + data.remarks + "&lco_acc_num=" + data.lcoAccNum + "&device_id=" + data.deviceId + "&rmn=" + data.mobileNumber + "&cmts=" + data.cmts + "&ref_id=" + config.REF_CONSTANT.userId;
            break;
        case "/create_lead":
            finalUrl += "&customerName=" + data.customerName + "&pincode=" + data.pincode + "&city=" + data.city + "&area=" + data.area + "&mobileNo=" + data.mobileNo + "&email=" + data.email + "&authUser";
            break;
        case "/getSalesPersonListByPincode":
            let currentCity = cityDetail.filter(function(obj) {
                return obj.eu_city == data.city;
            })[0];
            finalUrl += "&authUser=" + currentCity.authUser + "&pincode=" + data.pincode;
            break;
    }
    if (data.apiName != "/create_lead") { // to add authUser other than lead generation...
        finalUrl += "&authUser=" + customerId;
    }
    if (data.ticketType) {
        finalUrl += "&ticketType=" + data.ticketType;
    }
    if (data.apiName == "/createTicket") {
        finalUrl += "&disposition_id=" + data.disposition_id + "&remarks=" + data.remarks + "&lco_acc_num=" + data.lcoAccNum + "&device_id=" + data.deviceId + "&rmn=" + data.mobileNumber + "&cmts=NA&ref_id=" + config.REF_CONSTANT.userId;
    }
    console.log(finalUrl);
    request.post(finalUrl, args, function(data, resp) {
        if (!resp) {
            return false;
        }

        cb(resp["body"]);
    });

}

let getUserCreationFromHathwayServer = (data, cb) => {
    // fetch city detail from the city detail json file...
    let currentCity = cityDetail.filter(function(obj) {
        return obj.eu_city == data.city;
    })[0];
    let firstName = data.fullName.split(" ")[0];
    var lastName = data.fullName.split(" ")[1] ? data.fullName.substr(data.fullName.indexOf(" ") + 1): ".";
    console.log(data, "main data");
    // set content-type header and data as json in args parameter 
    var ts = firstName + Math.floor(new Date().valueOf() * Math.random());;
    //console.log(ts);
    var postData = {
        username: "AFFLE",
        credentials: "apassw0rd",
        source: "SCMOB",
        service_type: "0",
        sessionID: "ABC2872373737367663",
        authUser: currentCity.authUser,
        eu_account_type: 97,
        eu_model: 1,
        eu_subcriber_type: 63,
        eu_currency: 356,
        eu_lco_code: currentCity.eu_lco_code,
        eu_lco_name: currentCity.eu_lco_name,
        eu_username: ts,
        eu_sales_entity_code: data.salesPoid,
        eu_sales_name: data.salesName,
        eu_salution: data.salutation,
        eu_firstname: firstName,
        eu_lastname: lastName,
        eu_middlename: "",
        eu_mobile: data.mobile,
        eu_reg_mobile: data.mobile,
        eu_email: data.email,
        eu_contact_preference: 1,
        eu_pincode: data.pincode,
        eu_areacode: currentCity.eu_areacode,
        eu_area: currentCity.eu_area,
        eu_area_code: currentCity.eu_area_code,
        eu_street: currentCity.eu_street,
        eu_street_code: currentCity.eu_street_code,
        eu_location: currentCity.eu_location,
        eu_location_code: currentCity.eu_location_code,
        eu_building: currentCity.eu_building,
        eu_building_code: currentCity.eu_building_code,
        eu_doorno: data.landmark,
        eu_city: data.city,
        eu_state: currentCity.eu_state,
        eu_country: "INDIA",
        eu_region: currentCity.eu_region,
        eu_landmark: data.landmark,
        debit_acc_type: 1,
        team_name: currentCity.team_name,
        remarks: data.remarks,
        tds_received: 0,
        delivery_method: "",
        work_phone: "",
        home_phone: "",
        parent_or_child: 0,
        parent_accountID: "",
        parent_account_poid: "",
        inc_salutation: "",
        inc_first_name: "",
        inc_middle_name: "",
        inc_last_name: "",
        inc_pincode: data.pincode,
        inc_areacode: "",
        inc_area: currentCity.eu_area,
        inc_area_code: "",
        inc_street: currentCity.eu_street,
        inc_street_code: "",
        inc_location: currentCity.eu_building,
        inc_location_code: "",
        inc_building: ".",
        inc_building_code: "",
        inc_landmark: data.landmark,
        inc_doorno: data.landmark,
        inc_city: data.city,
        inc_state: currentCity.eu_state,
        inc_country: "INDIA",
        inc_region: currentCity.eu_region,
        corp_salutation: "",
        corp_firstname: "",
        corp_middlename: "",
        corp_lastname: "",
        corp_pincode: data.pincode,
        corp_area: currentCity.eu_area,
        corp_street: currentCity.eu_street,
        corp_location: currentCity.eu_location,
        corp_builidng: currentCity.eu_building,
        corp_doorno: 56,
        corp_landmark: data.landmark,
        corp_city: data.city,
        corp_state: "",
        corp_country: "INDIA",
        corp_region: currentCity.eu_region,
        eu_contact_preference: 1,
        end_id_proof: 2,
        end_address_proof: 5
    };
    console.log(postData);
    var encodedData = querystring.stringify(postData);

    /*var main_data = function(postData) {
        var str = [];
        for(var p in postData){
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(postData[p]));
         str.join("&");
        } 
    }*/

    var args = {
        data: encodedData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
    //console.log(args);
    var finalUrl = config.REST_SERVER_CONFIG.url + data.apiName;

    request({
        headers: {
            'Content-Length': encodedData.length,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: finalUrl,
        body: encodedData,
        method: 'POST'
    }, function(err, res, body) {
        console.log(body);
        cb(body);
    });

    /*    console.log(finalUrl);
        request.post(finalUrl, args, function (data, resp) {
            if(!resp){
                return false;
            }
            cb(resp["body"]);
        });    
       */
}

let uploadFileToS3Bucket = (file, folder, newFileName, callback) => {
    if (file == undefined) {
        console.log("No file file undefined");
        return callback("No File");
    } else {
        console.log(file);
        var filename = file.filename; // actual filename of file
        var path = file.path; //will be put into a temp directory
        var mimeType = file.mimetype;

        fs.readFile(path, function(error, file_buffer) {

            if (error) {
                console.log("No file");
                console.log(error);
                //  //console.log(error)
                return callback("No File");
            } else {
                var length = 5;
                var str = '';
                var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var size = chars.length;
                for (var i = 0; i < length; i++) {

                    var randomnumber = Math.floor(Math.random() * size);
                    str = chars[randomnumber] + str;
                }

                filename = newFileName;
                filename = filename.split(' ').join('-');


                var s3bucket = new AWS.S3();
                var params = {
                    Bucket: "mobileapp.hathway.net",
                    Key: folder + '/' + filename,
                    Body: file_buffer,
                    ACL: 'public-read',
                    ContentType: mimeType
                };

                s3bucket.putObject(params, function(err, data) {
                    if (err) {
                        console.log("No file");
                        console.log(err)
                        return callback("No File");
                    } else {
                        return callback(folder + '/' + filename);
                    }
                });
            }
        });
    }
};

let managePushFromHathwayServer = (template, data, cb) => {

    request.post({
            url: config.SOAP_PUSH_SERVER_CONFIG.url,
            body: mustache.render(template, data),
            method: 'POST',
            dataType: 'text',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': config.SOAP_PUSH_SERVER_CONFIG.soapAction
            }
        },
        (error, response, body) => {
            console.log(body);
            typeof body == "string" ? body = body.replace(/brm:/g, 'brm')
                .replace(/S:Envelope/g, 'sEnvelope')
                .replace(/xmlns:S/g, 'xmlns')
                .replace(/xmlns:ns2/g, 'xmlnsns2')
                .replace(/ns2:User_Notification_DetailsResponse/g, 'ns2Details')
                .replace(/return/g, 'rtrn')
                .replace(/ns2:Signout_App_NotifyResponse/g, 'ns2Signout_App_NotifyResponse')
                .replace(/ns2:Device_statusResponse/g, 'ns2Device_statusResponse')
                .replace(/S:Body/g, 'sBody') : "";

            parseString(htmlEnDeCode.htmlDecode(body), (err, result) => {

                cb(result);
            });
        });
}


let sendOPTviaSMS = (data) => {
    //data.phone = "9711442260";
    request.get({
        url: mustache.render(config.OTP_SMS_CONFIG.url, data),
        method: 'POST'
    });
}

let sendOPTviaMail = (data) => {
    //data.email = "neha.arora@affle.com";
    var mailOptions = {
        from: templates.mailTemplate.from,
        to: data.email,
        subject: templates.mailTemplate.subject,
        text: mustache.render(templates.mailTemplate.text, data)
    };
    mailModule.sendMail(mailOptions);
}

module.exports = {
    htmlEnDeCode: htmlEnDeCode,
    hathwayErrorCode: hathwayErrorCode,
    hathwayErrorMessage: hathwayErrorMessage,
    mailModule: mailModule,
    encryptData: encryptData,
    generateCustomDate: generateCustomDate,
    getSOAPDataFromHathwayServer: getSOAPDataFromHathwayServer,
    getRESTDataFromHathwayServer: getRESTDataFromHathwayServer,
    sendOPTviaSMS: sendOPTviaSMS,
    sendOPTviaMail: sendOPTviaMail,
    generateTransactionId: generateTransactionId,
    managePushFromHathwayServer: managePushFromHathwayServer,
    getUserCreationFromHathwayServer: getUserCreationFromHathwayServer,
    uploadFileToS3Bucket: uploadFileToS3Bucket
}
