import sanitize from "mongo-sanitize";
import Modlist from "../models/modlist";

export default function auth(app, jwt) {
  app.post("/auth/checkToken", (req, res) => {
    jwt.verify(sanitize(req.body.token), process.env.JWTSECRET, (err, decoded) => {
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
          user.pic = jwt.sign({"username": user.username, "password": user.password}, process.env.JWTSECRET, {expiresInMinutes: 720});
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
}
