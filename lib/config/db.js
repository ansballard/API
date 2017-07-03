module.exports = {
	getDev(username, password) {
		return `mongodb://${username}:${password}@ds051873.mlab.com:51873/modwatchdev`;
	},
	getLive(username, password) {
		return `mongodb://${username}:${password}@ds027708.mongolab.com:27708/skyrim`;
	},
	getNewLive(username, password) {
		return `mongodb://${username}:${password}@ds037283.mongolab.com:37283/modwatch`;
	},
	getLocal() {
		return "localhost:27017/modwatch";
	}
};
