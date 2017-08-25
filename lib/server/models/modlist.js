const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const modlistSchema = new Schema({
	username: String,
	password: String,
	plugins: [],
	modlist: [],
	ini: [],
	prefsini: [],
	skse: [],
	enblocal: [],
	roles: [],
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

modlistSchema.methods.updateFile = function updateFile(userFile, type) {

	let tempOld = [];
	const tempNew = [];
	tempOld = userFile.split("\",\"");
	tempOld[0] = tempOld[0].substring(2);
	tempOld[tempOld.length - 1] = tempOld[tempOld.length - 1].substring(0, tempOld[tempOld.length - 1].length - 2);
	for(let i = 0; i < tempOld.length; i++) {
		tempNew[i] = tempOld[i];
	}
	return tempNew;
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
