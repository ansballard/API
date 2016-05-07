"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	getDev: function getDev(username, password) {
		return "mongodb://" + username + ":" + password + "@ds051873.mongolab.com:51873/modwatchdev";
	},
	getLive: function getLive(username, password) {
		return "mongodb://" + username + ":" + password + "@ds027708.mongolab.com:27708/skyrim";
	},
	getNewLive: function getNewLive(username, password) {
		return "mongodb://" + username + ":" + password + "@ds037283.mongolab.com:37283/modwatch";
	},
	getLocal: function getLocal() {
		return "localhost:27017/modwatch";
	}
};