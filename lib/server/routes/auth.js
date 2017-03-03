const Promise = require("bluebird");
const { verify, sign } = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const Modlist = require("../models/modlist");

const verifyAsync = Promise.promisify(verify);

module.exports = function auth(app) {
  app.post("/auth/checkToken", (req, res) => {
    verifyAsync(sanitize(req.body.token), process.env.JWTSECRET)
    .then(({username}) => {
      res.json({username});
    })
    .catch(e => {
      res.sendStatus(403);
    });
  });

  app.post("/auth/signin", (req, res) => {
    Modlist.findOne({"username": sanitize(req.body.username)})
    .exec()
    .then(user => {
      if(user && user.validPassword(sanitize(req.body.password))) {
        user.pic = sign({"username": user.username, "password": user.password}, process.env.JWTSECRET, {expiresInMinutes: 720});
        user.save((saveErr, saveUser) => {
          if(saveErr) {
            res.sendStatus(500);
          } else {
            res.json({token: saveUser.pic});
          }
        });
      } else {
        res.sendStatus(403);
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });

  app.post("/auth/changepass", (req, res) => {
    verifyAsync(req.body.token, process.env.JWTSECRET)
    .then(({username}) =>
      Modlist.findOne({username})
      .exec()
    )
    .then(user => {
      user.password = user.generateHash(sanitize(req.body.password));
      user.save(err2 => {
        res.sendStatus(err2 ? 500 : 200);
      });
    })
    .catch(e => {
      res.sendStatus(403);
    });
  });
}
