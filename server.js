#!/usr/bin/env node
const getConnectionString = require("./lib/config/db");
const app = require("./lib/server/app");
const config = {
  connectionString: getConnectionString({env: process.env.NODE_ENV || "production", username: process.env.DBUSERNAME, password: process.env.DBPASSWORD}),
  expressSecret: process.env.DBEXPRESSSECRET,
  jwtSecret: process.env.JWTSECRET,
  ip: process.env.IP || process.env.OPENSHIFT_NODEJS_IP,
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT,
  env: "production"
};

app(config);
