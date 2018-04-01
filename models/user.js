const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
 name: {
 	type : String
 },
 email : {
 	type  : String,
 	required : true,
 //	unique: true,
 	lowercase : true,
 	trim : true

 },
 verified: {
        type: Boolean,
        default: false,
    },
 authyId: String,
 mobile: {
 	  type: Number, 
 	  limit : 10 ,
 	 required : true
 },
 username : {
 	type  : String,
 	required : true
 },
password : {
 	type  : String,
 	required : true
 },

});


const User = module.exports = mongoose.model('User', UserSchema);


module.exports.getUserById  = function(id, callback){

	User.findById(id, callback);
}


module.exports.getUserByUsername  = function(username, callback){

	const query = {username : username};
	User.findOne(query, callback);
}

module.exports.getUserByMobile  = function(mobile, callback){

	const query = {mobile : mobile};
	User.findOne(query, callback);
}


/* Saving new Users data to DB*/
module.exports.addUser = function(newUser, callback){
	bcrypt.genSalt(10, (err,salt) => {
		bcrypt.hash(newUser.password, salt, (err,hash) =>{
			
			if(err){
				throw err;
			}
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.comparePassword = function(candiatePassword, hash, callback){
	bcrypt.compare(candiatePassword,hash,(err,isMatch) =>{
		if(err) throw err;
		callback(null,isMatch);
	})

}