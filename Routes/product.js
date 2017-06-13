let express = require('express'),
    router = express.Router(),
    util = require('../Utilities/util'),
    productService = require('../Services/product');

var multer = require('multer'),
    path = require('path'),
    fs = require('fs');

var upload = multer({ dest: 'uploads/' });
//var upload  = multer({ dest: 'hathway_latest/uploads/' });

/* Get Customer's Payment History. */
var cpUpload = upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }])
router.post('/addNewProduct', cpUpload,(req, res) => {
    productService.addNewProduct(req.files,req, (data) => {
		res.setHeader('Access-Control-Allow-Origin','*');
        res.send(data);
    });
});


/* code to generate lead */
var cpUpload = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'personalPhotoId', maxCount: 1 }, { name: 'addressProof', maxCount: 1 }])
router.post('/createNewUser', cpUpload, (req, res) => {
    customerService.createNewUser(req.files, req, (data) => {
		res.setHeader('Access-Control-Allow-Origin','*');
        upload(req.files)
        res.send(data);
    });
});

// code to get the product list..
router.post('/productList', (req, res) => { //res.send('pk testing'); return;
    productService.productList(req, (data) => {
		res.setHeader('Access-Control-Allow-Origin','*');
			if(data!=undefined || data!=null){
				for(var i=0;i<data.result.length;i++){
					if(data.result[i].image1!='')
					{
						var NewString=fs.readFileSync(path.resolve('./uploads/' + data.result[i].image1.toString()));
						data.result[i].image1=NewString.toString('base64');
					}
					if(data.result[i].image2!='')
					{
						var NewString=fs.readFileSync(path.resolve('./uploads/' + data.result[i].image2.toString()));
						data.result[i].image2=NewString.toString('base64');
					}
					if(data.result[i].image3!='')
					{
						var NewString=fs.readFileSync(path.resolve('./uploads/' + data.result[i].image3.toString()));
						data.result[i].image3=NewString.toString('base64');
					}
					if(data.result[i].image4!='')
					{
						var NewString=fs.readFileSync(path.resolve('./uploads/' + data.result[i].image4.toString()));
						data.result[i].image4=NewString.toString('base64');
					}
					if(data.result[i].image5!='')
					{
						var NewString=fs.readFileSync(path.resolve('./uploads/' + data.result[i].image5.toString()));
						data.result[i].image5=NewString.toString('base64');
					}
					if(data.result[i].image6!='')
					{
						var NewString=fs.readFileSync(path.resolve('./uploads/' + data.result[i].image6.toString()));
						data.result[i].image6=NewString.toString('base64');
					}
				}
			}
        res.send(data);
	});
});

// code to get images uploaded by customers
router.get('/getCustomerUpload/:fileName', (req, res) => {
    if (req.params && req.params.fileName) {
        console.log(req.params.fileName);
        fs.readFile(path.resolve(`./uploads/${req.params.fileName}`), function(err, data) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'data:image/jpeg;base64' });
                //res.write('<html><body><img src="data:image/jpeg;base64,')
                res.end(new Buffer(data).toString('base64'));
                //res.end('"/></body></html>');
            } else {
                res.send("File is missing or some error occured!");
            }
        });
    } else {
        res.send("Invalid file name!")
    }
});


module.exports = router;
