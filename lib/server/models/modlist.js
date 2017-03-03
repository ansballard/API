const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

mongoose.Promise = require("bluebird");

const Schema = mongoose.Schema;

const modlistSchema = new Schema({
	list: String, // deprecated
	modlisttxt: String, // deprecated
	skyrimini: String, // deprecated
	skyrimprefsini: String, // deprecated
	username: String,
	password: String,
	plugins: [],
	modlist: [],
	ini: [],
	prefsini: [],
	skse: [],
	enblocal: [],
	tag: String,
	enb: String,
	game: String,
	pic: String,
	badge: String,
	token: String,
	timestamp: Date,
	score: {type: Number, default: 0},
	votedon: [{"username": String, "upvoted": Boolean}]
}, {
	collection: "modlist"
});

modlistSchema.methods.generateHash = function(_password) {
	return bcrypt.hashSync(_password, bcrypt.genSaltSync(8), null);
};

modlistSchema.methods.validPassword = function(_password) {
	try {
		return bcrypt.compareSync(_password, this.password);
	} catch (e) {
		return false;
	}
};

modlistSchema.methods.shrinkArrays = function shrinkArrays(type) {
	let save = false;
	if(this[type] && this[type].length > 0 && typeof this[type][0].name !== "undefined") {
		this[type] = this[type].map(({name}) => name);
		save = true;
	}
	if(save) {
		this.save();
	}
};

modlistSchema.methods.updateFile = function updateFile(userFile, type) {
	console.log("Deprecated Method");
};

/**
 *  Scoring Logic
 */

modlistSchema.methods.votedOnUser = function upvotedUser(username) {
	const info = {
		index: -1,
		upvoted: false
	};
	for(let i = 0; i < this.votedon.length; i++) {
		if(this.votedon[i].username === username) {
			info.index = i;
			info.upvoted = this.votedon[i].upvoted;
			break;
		}
	}
	return info;
};

module.exports = mongoose.model("Modlist", modlistSchema);
