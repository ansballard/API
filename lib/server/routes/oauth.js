const { join } = require("path");
const sanitize = require("mongo-sanitize");
const Modlist = require("../models/modlist");
const { encode, decode } = require("jwt-simple");

module.exports = function oauth(app) {

  app.get("/oauth/authorize", (req, res) => {
    res.render(join(__dirname, "..", "oauth.ejs"), {
      params: req.query,
      querystring: serialize(req.query)
    });
  });

  app.get("/oauth/verify", verify, (req, res) => {
    res.sendStatus(200);
  });

  app.post("/oauth/authorize", (req, res) => {
    console.log(JSON.stringify(req.query));
    const query = serialize(req.query);
    if(["username", "password"].filter(q => !!req.body[q]).length !== 2) {
      res.redirect(`/oauth/authorize?${query}&failed=${encodeURIComponent("Username/Password Required")}`);
      return;
    }
    Modlist.findOne({"username": `${req.body.username}`})
    .then(modlist => modlist && modlist.validPassword(`${req.body.password}`) ? modlist : Promise.reject(401))
    .then(modlist => {
      const iat = new Date().getTime();
      const token = {
        iss: "https://modwat.ch/",
        aud: "https://modwatchapi-ansballard.rhcloud.com/",
        sub: modlist.username,
        iat,
        exp: iat + (3600 * 1000)
      };
      res.redirect(`${decodeURIComponent(req.query.redirect_uri)}#access_token=${encode(token, process.env.JWTSECRET)}&token_type=Bearer&expires_in=${3600}`);
    })
    .catch(e => {
      res.redirect(`/oauth/authorize?${query}&failed=${encodeURIComponent("Invalid Credentials")}`);
    });
  });

};

function serialize(query) {
  return Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join("&");
}

function verify(req, res, next) {
  next();
  // TODO
}
