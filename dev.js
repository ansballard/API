const prompt = require("prompt");

const getConnectionString = require("./lib/config/db");
const app = require("./lib/server/app");

prompt.start();

prompt.get(
  {
    properties: {
      username: {
        message: "mlab dev database username",
        required: true
      }, password: {
        message: "mlab dev database password",
        required: true,
        hidden: true
      }
    }
  }, (err, { username, password }) => {
  const config = {
    connectionString: getConnectionString({username, password, env: "development"}),
    expressSecret: "development",
    jwtSecret: "development",
    ip: "0.0.0.0",
    port: 3001,
    env: "development"
  };

  app(config);
});
