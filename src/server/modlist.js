"use strict";

import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

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

modlistSchema.methods.shrinkArrays = function shrinkArrays() {
	let tempNew = [];
	let save = false;

	if(this.plugins && this.plugins.length > 0 && typeof this.plugins[0].name !== "undefined") {
		tempNew = [];
		for(let i = 0; i < this.plugins.length; i++) {
			tempNew.push(this.plugins[i].name);
		}
		this.plugins = tempNew;
		save = true;
	}
	if(this.modlist && this.modlist.length > 0 && typeof this.modlist[0].name !== "undefined") {
		tempNew = [];
		for(let i = 0; i < this.modlist.length; i++) {
			tempNew.push(this.modlist[i].name);
		}
		this.modlist = tempNew;
		save = true;
	}
	if(this.ini && this.ini.length > 0 && typeof this.ini[0].name !== "undefined") {
		tempNew = [];
		for(let i = 0; i < this.ini.length; i++) {
			tempNew.push(this.ini[i].name);
		}
		this.ini = tempNew;
		save = true;
	}
	if(this.prefsini && this.prefsini.length > 0 && typeof this.prefsini[0].name !== "undefined") {
		tempNew = [];
		for(let i = 0; i < this.prefsini.length; i++) {
			tempNew.push(this.prefsini[i].name);
		}
		this.prefsini = tempNew;
		save = true;
	}
	if(this.skse && this.skse.length > 0 && typeof this.skse[0].name !== "undefined") {
		tempNew = [];
		for(let i = 0; i < this.skse.length; i++) {
			tempNew.push(this.skse[i].name);
		}
		this.skse = tempNew;
		save = true;
	}
	if(this.enblocal && this.enblocal.length > 0 && typeof this.enblocal[0].name !== "undefined") {
		tempNew = [];
		for(let i = 0; i < this.enblocal.length; i++) {
			tempNew.push(this.enblocal[i].name);
		}
		this.enblocal = tempNew;
		save = true;
	}
	if(save) {
		this.save();
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

export default mongoose.model("Modlist", modlistSchema);
