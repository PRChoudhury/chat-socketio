var mongoose = require('mongoose');
var contactSchema = mongoose.Schema({
	name: String,
    email: String,
    number: String,
    imageProfile: String   

})
//db connection ends 
//var models= mongoose.model('contactlists', contactSchema);
var collectionName = 'contactlist';
var contactModel = mongoose.model('contactlist', contactSchema, collectionName)
module.exports = contactModel;