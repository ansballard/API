const { join } = require("path");
const sanitize = require("mongo-sanitize");
const Modlist = require("../models/modlist");
const { encode, decode } = require("jwt-simple");

module.exports = function oauth(app, { jwtSecret, env }) {

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
    const query = serialize(req.query);
    const scopes = req.body.scopes || [];
    if(["username", "password"].filter(q => !!req.body[q]).length !== 2) {
      res.redirect(`/oauth/authorize?${query}&failed=${encodeURIComponent("Username/Password/Scope Required")}`);
      return;
    }
    if(req.query.redirect_uri.indexOf("https://modwat.ch") !== 0) {
      res.redirect(`/oauth/authorize?${query}&failed=${encodeURIComponent("Login must be initiated from https://modwat.ch")}`);
      return;
    }
    Modlist.findOne({"username": `${req.body.username}`})
    .then(modlist => modlist && modlist.validPassword(`${req.body.password}`) ? modlist : Promise.reject(401))
    .then(modlist => scopes.filter(s => modlist.roles.includes(s)).length === scopes.length ? modlist : Promise.reject(401))
    .then(modlist => {
      const iat = new Date().getTime();
      const token = {
        iss: "https://modwat.ch/",
        aud: "https://modwatchapi-ansballard.rhcloud.com/",
        sub: modlist.username,
        iat,
        exp: iat + (3600 * 1000),
        scopes: [...new Set(["user"].concat(scopes).concat(modlist.roles))]
      };
      res.redirect(`${decodeURIComponent(req.query.redirect_uri)}oauth/access_token/${encodeURIComponent(encode(token, jwtSecret))}/token_type/Bearer/expires_in/3600`);
    })
    .catch(e => {
      console.log(e);
      res.redirect(`/oauth/authorize?${query}&failed=${encodeURIComponent("Invalid Credentials")}`);
    });
  });

	app.delete("/oauth/user/:username/delete", verify, (req, res) => {
    if(req.params.username !== req.access_token.sub && !req.access_token.scopes.includes("admin")) {
      res.sendStatus(401);
      return;
    }
		Modlist.findOne({username: req.params.username})
    .then(profile => {
      if(
        req.access_token.scopes.includes("admin") &&
        req.params.username !== req.access_token.sub &&
        profile.roles.includes("admin")
      ) {
        res.sendStatus(401);
        return;
      }
			return profile.remove()
      .then(() => {
				res.sendStatus(200);
			})
    })
    .catch(e => {
      res.sendStatus(500);
    });
	});

  function serialize(query) {
    return Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join("&");
  }

  function verify(req, res, next) {
    try {
      const token = decode(req.get("Authorization").slice(7), jwtSecret);
      if(new Date() > new Date(token.exp)) {
        res.sendStatus(401);
        return;
      }
      req.access_token = token;
      next();
    } catch(e) {
      res.sendStatus(401);
    }
  }

  function verifyAdmin(req, res, next) {
    verify(req, res, () => {
      if(req.access_token.scopes.includes("admin")) {
        next();
      } else {
        res.sendStatus(403);
      }
    })
  }

};
