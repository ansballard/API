const prompt = require("prompt");

const getConnectionString = require("./lib/config/db");
const app = require("./lib/server/app");

prompt.start();

prompt.get(
  {
    properties: {
      username: {
        message: "mlab database username",
        required: true
      }, password: {
        message: "mlab database password",
        required: true,
        hidden: true
      },
      env: {
        message: "Database to connect to (development|production|local)",
        default: "development",
        pattern: /(development|production|local)/
      }
    }
  }, (err, { username, password, env }) => {
  if(err || !username || !password || !env) {
    console.log("Error during setup, try again");
    process.exit(0);
  }
  const config = {
    connectionString: getConnectionString({username, password, env}),
    expressSecret: "development",
    jwtSecret: "development",
    ip: "0.0.0.0",
    port: 3001,
    env: "development"
  };
  let server = app(config);
});
