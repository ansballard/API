const getConnectionString = require("./lib/config/db");
const app = require("./lib/server/app");

const config = {
  connectionString: getConnectionString({env: "production"}),
  expressSecret: process.env.DBEXPRESSSECRET,
  jwtSecret: process.env.JWTSECRET,
  ip: process.env.OPENSHIFT_NODEJS_IP,
  port: process.env.OPENSHIFT_NODEJS_PORT,
  env: "production"
};

app(config);
