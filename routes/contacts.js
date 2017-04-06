var express = require('express');
var router = express.Router();
var contactmodel = require('../models/contactModel');

var multer = require("multer");
var clientSMS = require('twilio')('ACad207f7afc4c7e2d9978c164983f9f54','457d507c7b1e390292f92704ce6f9c39');
var upload = multer({dest: '../public/app/images'});

router.get('/contactlist',function(req,res){

console.log("recieved get request");
contactmodel.find({},function(err,docs){
	console.log("in");
	console.log(docs);
	res.json(docs);

})

});



router.post('/contactlist',function(req,res){

	console.log(req.body);
	contactmodel.find({$or:[{name:req.body.name},{email:req.body.email},{number:req.body.number}]} , function(err,docs){

			if(docs.length == 0){
		//		console.log(docs.length);
		//		return false;
			contactmodel.create(req.body,function(err,docs){
			//res.json(docs);
			//return false;
			contactmodel.find(function(err,docs){
			//console.log(docs);
			console.log(docs.length+"YEs..write to db");
			res.json(docs);
		});
		});

	}else {
		//res.json(1);
		res.json(docs);

	}

});

	
});	

router.delete('/contactlist/:id',function(req,res){

	var id = req.params.id;
	contactmodel.remove({_id:id},function(err,docs){
		M.find(function(err,docs){
		console.log(docs);
		res.json(docs);
		});
	})
});

router.get('/contactlist/:id',function(req,res){
	var id = req.params.id;
	contactmodel.findOne({_id:id},function(err,docs){
		console.log(docs);
			res.json(docs);

	})
});

router.put('/contactlist/:id',function(req,res){
	var id = req.params.id;
	contactmodel.findOneAndUpdate(
		{
				_id:id
		},
		{ $set: { name:req.body.name,email:req.body.email,number:req.body.number}},
		
		function(err,docs){
			contactmodel.find(function(err,docs){
			//console.log(docs);
		res.json(docs);
		});	

	});

});

router.post('/testtwilio/:id',function(req,res){
	var tonum = "+91"+req.params.id;
	clientSMS.sendMessage({
	to: tonum, 
    body: req.body.content,
    // Text this number
    from: '+19728856128' // From a valid Twilio number
}, function(err, message) {
	res.json(message);
    console.log(message);
   // exit();
});

});

router.post('/uploads/:id', upload.any(), function(req, res, next) {
   // console.log('files:', req.file.originalname);
    //console.log('body:', req.body);
    // more code
    var id = req.params.id;
    //console.log(uidu+"---------->");
    //var id = "589b052036a2791c68fd6935";
	contactmodel.findOneAndUpdate(
		{_id:id},
		{ $set: { imageProfile:req.files[0].filename}},
		function(err,docs){
			contactmodel.find(function(err,docs){
			console.log(docs);
		res.json(docs);
		});	

	});
});

module.exports = router;
