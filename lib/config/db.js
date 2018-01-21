// exports.getDev = (username, password) => `mongodb://${username}:${password}@ds051873.mlab.com:51873/modwatchdev`;
// exports.getLive = (username, password) => `mongodb://${username}:${password}@ds037283.mongolab.com:37283/modwatch`;
// exports.getLocal = () => "localhost:27017/modwatch";
//
// if(process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_NODEJS_IP) {
// 	configDB = db.getNewLive(process.env.DBUSERNAME, process.env.DBPASSWORD);
// } else if(process.env.DEV_MODWATCH_DBUSERNAME && process.env.DEV_MODWATCH_DBPASSWORD) {
// 	configDB = db.getDev(process.env.DEV_MODWATCH_DBUSERNAME, process.env.DEV_MODWATCH_DBPASSWORD);
// } else {
// 	configDB = db.getLocal();
// }

module.exports = ({ username, password, env, url }) =>
  url
    ? `mongodb://${username ? `${username}:${password}@` : ""}${url}/modwatch`
    : env === "production"
      ? `mongodb://${username}:${password}@ds037283.mlab.com:37283/modwatch`
      : env === "development"
        ? `mongodb://${username}:${password}@ds051873.mlab.com:51873/modwatchdev`
        : "mongodb://localhost:27017/modwatch";
