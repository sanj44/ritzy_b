let app = require('express')(),
    server = require('http').Server(app),
    bodyParser = require('body-parser');

var express = require('express');

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
//app.use(express.static(__dirname + '/Client'));
//app.use(express.static(__dirname + '/uploads'));


var CronJob = require('cron').CronJob;
var mongoose = require('./Utilities/mongooseConfig')();

let productRoute = require('./Routes/product')
    config = require("./Utilities/config").config;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(err, req, res, next) {
  return res.send({ "errorCode": util.hathwayErrorCode.ONE, "errorMessage": util.hathwayErrorMessage.SOMETHING_WENT_WRONG });
  //next();
});

app.use('/product', productRoute);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    res.send({ "errorCode": util.hathwayErrorCode.FOUR_ZERO_FOUR, "errorMessage": util.hathwayErrorMessage.PAGE_NOT_FOUND })
    //next();
});*/

//server.listen(3008);

/*first API to check if server is running*/
app.get('/', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin','*');
    res.send('hello, world!');
});


// if (cluster.isMaster) {
    // console.log("master processor")
    // // for (var i = 0; i < numCPUs; i++) {
        // // cluster.fork();
    // // }
    
// } else {
    // console.log("worker process");
server.listen(config.NODE_SERVER_PORT.port);
// }
