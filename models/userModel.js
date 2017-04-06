var mongoose = require('mongoose');
var bcrypt  =require('bcryptjs');

//**************************************************************************************************************
// MONGOOSE VALIDATOR  is used to validate the data at backend.
// refer MEAN Stack App Part 12: Back-End Validation w/Mongoose & Regular Expressions (RegEx)  for details.
// You tube link ::::::::::: https://www.youtube.com/watch?v=YMiSsxeD_D0
//**************************************************************************************************************



var validate = require('mongoose-validator');

var emailValidator = [

validate({
	validator : 'isEmail',
	message   : 'Invalid email.'

}),

validate({
  validator: 'isLength',
  arguments: [3, 50],
  message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
})
];


var userSchema = mongoose.Schema({
	name: {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true,validate:emailValidator},
    active: {type:Boolean, required:true , default:false},
    temporarytoken :{type:String , required:true},
    pass: String,
    imageProfile: String   

});
//db connection ends 
//var models= mongoose.model('contactlists', contactSchema);
var collectionName = 'users';
var usermodel = mongoose.model('users', userSchema, collectionName)
module.exports = usermodel;
module.exports.createUser = function(newUser,callback){
	bcrypt.genSalt(10,function(err,salt){

		bcrypt.hash(newUser.pass,salt ,function(err,hash){
			newUser.pass = hash;
			newUser.save(callback);

		});
	});

}

module.exports.getUserByUsername = function(username ,callback){

	var query = {name:username};
	usermodel.findOne(query,callback);
}

module.exports.getuserById = function(id ,callback){

	usermodel.findById(id,callback);
}



module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err, isMatch){
		if(err) throw err;
		callback(null,isMatch);

	});

}



