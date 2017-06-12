let environment = require('./environment').environment;

let serverURLs = {
    "dev": {
        "HATHWAY_SOAP_SERVICE": "http://11.11.11.11:7104",
        "HATHWAY_PUSH__SOAP_SERVICE": "http://11.11.1.11:8080/PushNotifyWS_test",
        "HATHWAY_REST_SERVICE": "http://11.11.11.11",
        "NODE_SERVER": "http://abc.abcd.net",
        "NODE_SERVER_PORT": "3000",
        "MONGO_DB": "mongodb://sanj44:sanj1234@ds163681.mlab.com:63681/ecom",
        "CITRUS_ACCESS": "dsdfsdfsdfsdfsdfsf",
        "CITRUS_URL": "https://asdfasdfasfd.citruspay.com",
        "CITRUS_SECRET": "asdfasfdasdfasf",
        "EMAIL_USER": 'abc@gmail.com',
        "EMAIL_PASS": '12345678!',
        "EMAIL_HOST": 'smtp.gmail.com',
        "EMAIL_PORT": 465,
        "EMAIL_SECURE": true,
        "REF_CONSTANT": '3648272752',
        "CRON_PATTERN": '15 * * * * *',
        "SMS_API": '',
        "S3_ACCESS_KEY_ID": "sdfsdfsdfsdfsdfdsfsd",
        "S3_SECRET_ACCESS_KEY": "ssdfsdfsdfsdfsdfsdf",
        "S3_REGION": "qwqwqwqw"
    }
    
}

let config = {
    "SOAP_SERVER_CONFIG": {
        "url": `${serverURLs[environment].HATHWAY_SOAP_SERVICE}/infranetwebsvc/services/BRMBaseServices?wsdl`,
        "soapAction": `${serverURLs[environment].HATHWAY_SOAP_SERVICE}/infranetwebsvc/services`
    },
    "SOAP_PUSH_SERVER_CONFIG": {
        "url": `${serverURLs[environment].HATHWAY_PUSH__SOAP_SERVICE}/PushNotifyWS?wsdl`,
        "soapAction": `${serverURLs[environment].HATHWAY_SOAP_SERVICE}/services`
    },
    "REST_SERVER_CONFIG": {
        "url": `${serverURLs[environment].HATHWAY_REST_SERVICE}/oapmobapp/scmobapp`
    },
    "OTP_SMS_CONFIG": {
        "url": `${serverURLs[environment].SMS_API}`
    },
    "REF_CONSTANT": {
        "userId": `${serverURLs[environment].REF_CONSTANT}`
    },
    "REF_CONSTANT_USER_ID": {
        "userId": `0.0.0.1 /account ${serverURLs[environment].REF_CONSTANT} 0`
    },
    "DB_URL": {
        "url": `${serverURLs[environment].MONGO_DB}`
    },
    "NODE_SERVER_PORT": {
        "port": `${serverURLs[environment].NODE_SERVER_PORT}`
    },
    "NODE_SERVER_URL": {
        "url": `${serverURLs[environment].NODE_SERVER}`
    },
    "S3_ACCESS_KEY_ID": {
        "id": `${serverURLs[environment].S3_ACCESS_KEY_ID}`
    },
    "S3_SECRET_ACCESS_KEY": {
        "key": `${serverURLs[environment].S3_SECRET_ACCESS_KEY}`
    },
    "S3_REGION": {
        "region": `${serverURLs[environment].S3_REGION}`
    },
    "CRON_PATTERN": {
        "pattern": `${serverURLs[environment].CRON_PATTERN}`
    },
    "OTP_EMAIL_CONFIG": {
        "host": `${serverURLs[environment].EMAIL_HOST}`,
        "port": `${serverURLs[environment].EMAIL_PORT}`,
        "secure": `${serverURLs[environment].EMAIL_SECURE}`,
        "auth": {
            "user": `${serverURLs[environment].EMAIL_USER}`,
            "pass": `${serverURLs[environment].EMAIL_PASS}`,
        }
    },
    "PAYMENT_GATEWAY": {
        "CITRUS": {
            "pg_url": `${serverURLs[environment].CITRUS_URL}`,
            "access_key": `${serverURLs[environment].CITRUS_ACCESS}`,
            "secret_key": `${serverURLs[environment].CITRUS_SECRET}`,
            "return_url": `${serverURLs[environment].NODE_SERVER}/citrus/return`
        }
    }
};

module.exports = {
    config: config
};
