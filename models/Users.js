var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

//user schema
var userSchema = mongoose.Schema({
	username:{
		type:String,
		index:true
	},
	password:{
		type:String
	},
	email:{
		type:String
	},
	name:{
		type:String
	},
	Images:{
		type:String
	}
});

var users = module.exports = mongoose.model('Users',userSchema);

module.exports.getUserName = function(username, callback){
	users.findOne({username:username},callback);
}

module.exports.comparePassword = function(password,hash,callback){
	console.log("Here");
	console.log("password",password);
	console.log("hash",hash);
	bcrypt.compare(password,hash,function(err,IsMatched){
		callback(null,IsMatched);
	})
}

module.exports.getUserById = function(id,callback){
  users.findById(id,callback);
}


module.exports.createUser = function(newUser, callback){
		console.log(newUser);
		bcrypt.genSalt(10,function(err, salt){
			bcrypt.hash(newUser.password,salt,function(err,hash){
				console.log(hash);
				newUser.password  = hash;
				newUser.save(callback);
			});
		});
}