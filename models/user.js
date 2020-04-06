var mongoose = require ("mongoose");
var passportLocalMongoose = require ("passport-local-mongoose");

var userSchema = new mongoose.Schema ({
	username: String,
	password: String,
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	incoming: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	outgoing:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	ignored: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
	// incoming: [{userId: String}],
	// outgoing: [{userId: String}]
});

userSchema.plugin (passportLocalMongoose);
module.exports = mongoose.model ("User", userSchema) ;