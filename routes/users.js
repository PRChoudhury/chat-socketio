var express = require('express');
var router = express.Router();
var passport = require('passport');
var usermodel = require('../models/userModel');
var jwt = require('jsonwebtoken');
var secret = 'thisisverydifficult';
var LocalStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
// var options = {
// 	auth: {
// 		api_key: 'SENDGRID_APIKEY'
// 	}
// }

// // or


/* GET users listing. */
router.route('/register')

	.post(function(req,res){

		var options = {
		auth: {
		//	api_user: 'prithwi',
			api_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
			
		}
	}
		
	var mailer = nodemailer.createTransport(sgTransport(options));


		var name = req.body.name;
		var email = req.body.email;
		var password = req.body.pass;
		//var password2 = req.body.pass2;
		var imageProfile = "emptyPic.jpg";

			console.log(req.body.name);

	var newUser	 = new usermodel({

		name :name,
		email :email,
		pass:password,
		temporarytoken: jwt.sign({username : name , email:email},secret,{expiresIn:'24h'}),

		imageProfile :imageProfile
		});


	usermodel.createUser(newUser,function(err,user){

		

		if(err) {
			if(err.errors !=null){
				if(err.errors.email){
					res.json({success:false,message:err.errors.email.message})
				}

			}
			else{
			res.json({
				success:false , 
				message : 'Email /name already exisits.'});
				return false;
			}
		}else{


			var email = {
				to: newUser.email,
				from: ['prithwiApp', 'apptest@localhost.com'],
				subject: 'Account Activation',
				text: 'Awesome sauce',
				html: 'Hello ,<b>'+newUser.name+'</b><br>Thank You for registering into our website . Please visit the below link for account activation:<br><a href = "http://localhost:3000/activate/'+newUser.temporarytoken+'">Click here to activate your account</a>'
			};

			mailer.sendMail(email, function(err, res) {
				if (err) { 
					console.log(err) 
				}
				console.log(" Message sent : "+res);
			});


			res.json({
				message : "You are registered .Please visit your email for account activation.",
				success : true

			});
	}
		//console.log(user);

	});

	//req.flash('success_msg' , 'You are registered and can now login');
	//console.log("registerd");
	
	//res.redirect('/index.html');
	//$scope.usersuccess =true;


	});

passport.use(new LocalStrategy(
	function (username,password,done){
			
			usermodel.getUserByUsername(username,function(err,user,info){
				if(err) throw err;
				if(!user){
					return done(null , false ,{message:'Could not authenticate user.'})
				}
			usermodel.comparePassword(password,user.pass, function(err,isMatch){
				if(err) throw err;
					if(isMatch){

						var token  = jwt.sign({
  												username : user.name , email:user.email
											},secret,{expiresIn:'24h'});
						//var token  = {token:token};
						return done (null,token);
					}else {
						return done(null,false,{message:"Invalid password."});
					}

				});
			});
	}));




passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  	usermodel.getuserById(id, function(err, user) {
    done(err, user);
  });
});

/*app.post('/users/login',passport.authenticate('local'),	function(req,res){
		
		res.send(req.user);
		//res.send(req.message);
		//res.redirect('/home');

	});

*/

router.post('/authenticate', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      console.log(user+"------from server");
        if (err) {
            return next(err);
        }

        if (!user) {
            res.send(info);
            return false;
        }
        res.send(user);

       //req,logIn is used for creating sessions and not required in JWT ********************
       // req.logIn(user, function (err) {
         //   if (err) {
           //     return next(err);
           // }
           // res.send(user);
       // });
    })(req, res, next);
});

router.put('/activate/:token' ,function(req,res){
	console.log("in");

	usermodel.findOne({temporarytoken:req.params.token}, function(err,user){

			if(err) throw err;
			var token = req.params.token;
			jwt.verify(token,secret,function(err,decoded){
				if(err){
					res.json({success:false,message:"Activation link has expired."});
				}else if(!user){
					res.json({success:false,message:"Activation link has expired."});	
				}else{
					user.temporarytoken = false;
					user.active = true;
					user.save(function(err){

						if(err){
							console.log(err);
						}else{

						var email = {
							to: user.email,
							from: ['prithwiApp', 'apptest@localhost.com'],
							subject: 'Account Activated',
							text: 'Awesome sauce',
							html: '<b>Account activated</b>'
						};

						mailer.sendMail(email, function(err, res) {
							if (err) { 
								console.log(err) 
							}
							console.log(" Message sent : "+res);
						});

							res.json({success:true,message:"Account has been successfully activated."});
						}

					});

					
				}

			});


	});

});

router.use(function(req,res,next){

var token = req.body.token || req.body.query || req.headers['x-access-token'];
//console.log(token+"-------->checking from router.use");
if(token){
	jwt.verify(token,secret,function(err,decoded){
		if(err){
			res.json({success:false,message:"Token invalid"});
		}else{
			req.decoded = decoded;
			next();
		}

	});
}else{
	res.json({success:false,message:"No token provided."})
}

});

router.post('/me' , function(req,res){
	res.send(req.decoded);
	
});




module.exports = router;