const { router, get, post } = require("microrouter");
const corsBuilder = require("micro-cors");
const compress = require("micro-compress");

const routes = require("./routes");

const cors = corsBuilder({
  allowMethods: ["GET", "POST", "DELETE", "OPTIONS"]
});

module.exports = cors(compress(router(...routes)));
