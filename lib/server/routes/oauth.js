const { join } = require("path");
const sanitize = require("mongo-sanitize");
const Modlist = require("../models/modlist");
const { encode, decode } = require("jwt-simple");

module.exports = function oauth(app) {

  app.get("/oauth/authorize", (req, res) => {
    res.render(join(__dirname, "..", "oauth.ejs"), {
      params: req.query
    });
  });

  app.post("/oauth/authorize", (req, res) => {
    Modlist.findOne({"username": `${req.body.username}`})
    .then(modlist => modlist && modlist.validPassword(`${req.body.password}`) ? modlist : Promise.reject(401))
    .then(modlist => {
      const iat = new Date().getTime();
      const token = {
        iss: "https://modwat.ch/",
        aud: "https://modwatchapi-ansballard.rhcloud.com/",
        sub: modlist.username,
        scope: "read write",
        iat,
        exp: iat + (3600 * 1000)
      };
      res.redirect(`${decodeURIComponent(req.body.redirect_uri)}#access_token=${encode(token, process.env.JWTSECRET)}&token_type=Bearer&expires_in=${3600}`);
    })
    .catch(e => {
      res.redirect("/oauth/authorize?failed");
    });
  });

};
