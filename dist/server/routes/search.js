"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = search;

var _modlist = require("../modlist");

var _modlist2 = _interopRequireDefault(_modlist);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function search(app) {
  app.get("/api/search/file/:filetype/:querystring", function (req, res) {
    if ((0, _utils.validFiletype)(req.params.filetype)) {
      var query = {};
      query[req.params.filetype] = new RegExp(".*" + req.params.querystring + ".*", "i");
      _modlist2.default.find(query, { username: 1, timestamp: 1 }).sort({ "timestamp": -1 }).limit(50).exec(function (err, users) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json({ users: users.map(function (u) {
              return u.username;
            }), length: users.length, newUsers: users.map(function (u) {
              return { username: u.username, timestamp: u.timestamp, score: u.score };
            }) });
        }
      });
    } else {
      res.sendStatus(500);
    }
  });
  app.get("/api/search/users/:query/:limit?", function (req, res) {
    if (!req.params.query) {
      res.sendStatus(400);
    } else {
      _modlist2.default.find({ "username": new RegExp(".*" + req.params.query + ".*", "i") }, { username: 1, timestamp: 1, score: 1 }).sort({ "timestamp": -1 }).limit(req.params.limit || 25).exec(function (err, users) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.set("Content-Type", "application/json");
          res.json(users.map(function (u) {
            return { username: u.username, timestamp: u.timestamp, score: u.score };
          }));
        }
      });
    }
  });
}