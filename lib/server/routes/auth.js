const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
const Modlist = require("../models/modlist");

module.exports = function auth(app) {
  app.post("/auth/checkToken", (req, res) => {
    jwt.verify(sanitize(req.body.token), process.env.LOCAL ? "LOCAL" : process.env.JWTSECRET, (err, decoded) => {
      if(err) {
        res.sendStatus(403);
      } else {
        res.json({"username": decoded.username});
      }
    });
  });

  app.post("/auth/signin", (req, res) => {
    Modlist.findOne({"username": sanitize(req.body.username)}, (err, user) => {
      if(err) {
        res.sendStatus(500);
      } else {
        if(user && user.validPassword(sanitize(req.body.password))) {
          user.pic = jwt.sign({"username": user.username, "password": user.password}, process.env.LOCAL ? "LOCAL" : process.env.JWTSECRET, {expiresInMinutes: 720});
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
      }
    });
  });

  app.post("/auth/changepass", (req, res) => {
    jwt.verify(req.body.token, process.env.JWTSECRET, (jwtVerifyErr, decoded) => {
      if(jwtVerifyErr) {
        res.sendStatus(401);
      } else {
        Modlist.findOne({username: decoded.username}, (err, user) => {
          if(err) {
            res.sendStatus(401);
          } else {
            user.password = user.generateHash(sanitize(req.body.password));
            user.save(err2 => {
              res.sendStatus(err2 ? 500 : 200);
            });
          }
        });
      }
    });
  });

  // app.post("/auth/login", (req, res) => {
  //   if(["username", "password"].some(query => !req.body[query])) {
  //     res.sendStatus(400);
  //     return;
  //   }
  //   Modlist.findOne({"username": sanitize(req.body.username)})
  //   .then(user => {
  //     if(user && user.validPassword(sanitize(req.body.password))) {
  //     jwt.sign({username: user.username, timestamp: new Date().getTime()}, process.env.JWTSECRET, {expiresInMinutes: 720});
  //     } else {
  //       res.sendStatus(401);
  //     }
  //   })
  //   .catch(e => {
  //     res.sendStatus(500);
  //   });
  // });
}
