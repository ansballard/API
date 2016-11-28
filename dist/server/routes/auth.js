"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = auth;

var _mongoSanitize = require("mongo-sanitize");

var _mongoSanitize2 = _interopRequireDefault(_mongoSanitize);

var _modlist = require("../models/modlist");

var _modlist2 = _interopRequireDefault(_modlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function auth(app, jwt) {
  app.post("/auth/checkToken", function (req, res) {
    jwt.verify((0, _mongoSanitize2.default)(req.body.token), process.env.JWTSECRET, function (err, decoded) {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({ "username": decoded.username });
      }
    });
  });

  app.post("/auth/signin", function (req, res) {
    _modlist2.default.findOne({ "username": (0, _mongoSanitize2.default)(req.body.username) }, function (err, user) {
      if (err) {
        res.sendStatus(500);
      } else {
        if (user && user.validPassword((0, _mongoSanitize2.default)(req.body.password))) {
          user.pic = jwt.sign({ "username": user.username, "password": user.password }, process.env.JWTSECRET, { expiresInMinutes: 720 });
          user.save(function (saveErr, saveUser) {
            if (saveErr) {
              res.sendStatus(500);
            } else {
              res.json({ token: saveUser.pic });
            }
          });
        } else {
          res.sendStatus(403);
        }
      }
    });
  });

  app.post("/auth/changepass", function (req, res) {
    jwt.verify(req.body.token, process.env.JWTSECRET, function (jwtVerifyErr, decoded) {
      if (jwtVerifyErr) {
        res.sendStatus(401);
      } else {
        _modlist2.default.findOne({ username: decoded.username }, function (err, user) {
          if (err) {
            res.sendStatus(401);
          } else {
            user.password = user.generateHash((0, _mongoSanitize2.default)(req.body.password));
            user.save(function (err2) {
              res.sendStatus(err2 ? 500 : 200);
            });
          }
        });
      }
    });
  });
}