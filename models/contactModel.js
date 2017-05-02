var mongoose = require('mongoose');
var contactSchema = mongoose.Schema({
	name: {type:String,required:true},
    email: {type:String,required:true},
    number: {type:String,required:true},
    imageProfile: {type:String, required:true , default:'emptyPic.jpg'},
    altnumber : String,
    address : String,
    uemail : {type:String,required:true}

})
//db connection ends 
//var models= mongoose.model('contactlists', contactSchema);
var collectionName = 'contactlist';
var contactmodel = mongoose.model('contactlist', contactSchema, collectionName)
module.exports = contactmodel;