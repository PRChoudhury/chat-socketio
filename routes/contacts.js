var express = require('express');
var router = express.Router();
var contactmodel = require('../models/contactModel');
var usermodel = require('../models/userModel');
var jwt = require('jsonwebtoken');
var secret = 'thisisverydifficult'; 

var multer = require("multer");
var clientSMS = require('twilio')('ACad207f7afc4c7e2d9978c164983f9f54','457d507c7b1e390292f92704ce6f9c39');
var upload = multer({dest: 'public/app/images'});

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');


var options = {
		auth: {
		//	api_user: 'prithwi',
			api_key: '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'
			
		}
	}
		
var mailer = nodemailer.createTransport(sgTransport(options));


router.post('/sendemail/:id' , function(req,res){
	var email = {
		to:req.params.id,
		from: ['ContactManagerApp', 'contact_manager@localhost.com'],
		subject: req.body.sub,
		text: req.body.sub,
		html: req.body.email


	};
	mailer.sendMail(email, function(err, res) {
				if (err) { 
					console.log(err) 
				}
				console.log(" Message sent : "+res);
	});

	res.json({success:true , message:"Email sent to - "+req.params.id});
});

router.get('/contactlist/:token',function(req,res){
	var token = req.params.token;
	jwt.verify(token,secret,function(err,decoded){
	//console.log(decoded);
	console.log("recieved get request");
	contactmodel.find({uemail:decoded.email},function(err,docs){
	console.log("in");
	//console.log(docs);
	res.json(docs);
		});
	});

});



router.post('/contactlist/:token',function(req,res){
	
	//console.log(req.params.token);
	//console.log(req.body);

	var token = req.params.token;
	jwt.verify(token,secret,function(err,decoded){
		if(err) throw err;
		var contact = new contactmodel({
			name : req.body.name,
			email : req.body.email,
			number : req.body.pnumber,
			altnumber : req.body.altnumber,
			address : req.body.address,
			uemail : decoded.email
		});
	contactmodel.findOne({$and:[{name:req.body.name},{uemail:decoded.email}]} , function(err,user){
		if(err) throw err;

		if(!user){
		contactmodel.create(contact,function(err,user){

			if(err){

				//res.json({success:false , message:"Contact details are not unique."});
				res.json({success:false , message:err});
			}else{
				
				contactmodel.find({uemail : decoded.email} ,function(err,user){
					res.json({success:true, message:"New contact added successfully." ,user});
				});
		
			}

			});
			}else{

				res.json({success:false , message:"Contact already exists using given name."})
			}
		});
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
	//console.log(id);
	contactmodel.findOneAndUpdate(
		{
				_id:id
		},
		{ $set: { name:req.body.name,email:req.body.email,number:req.body.number,altnumber:req.body.altnumber,address:req.body.address}},
		
		function(err,docs){
			if(err) throw err;
			//console.log(docs);
			contactmodel.findOne({_id:id} ,function(err,docs){
			//	console.log(docs);
			res.json({docs,success:true,message:"Contact saved."});
		});	

	});

});

router.post('/testtwilio/:id',function(req,res){
	var tonum = "+91"+req.params.id;
	clientSMS.sendMessage({
	to: tonum, 
    body: req.body.sms,
    // Text this number
    from: '+19728856128' // From a valid Twilio number
}, function(err, message) {
	res.json(message);
    console.log(message);
   // exit();
});

});

router.post('/uploads/:id', upload.any(), function(req, res, next) {
	console.log(req.body.login);

   	//console.log('files:', req.file.originalname);
    //console.log('body:', req.body);
    // more code
    var id = req.params.id;
    //console.log(uidu+"---------->");
    //var id = "589b052036a2791c68fd6935";
	contactmodel.findOneAndUpdate(
		{_id:id},
		{ $set: { imageProfile:req.files[0].filename}},
		function(err,docs){
			contactmodel.find({uemail:req.body.login},function(err,docs){
			console.log(docs);
			res.json(docs);
		});	

	});
});

module.exports = router;
