"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = users;

var _modlist = require("../modlist");

var _modlist2 = _interopRequireDefault(_modlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function users(app) {
  app.get("/api/users/count", function (req, res) {
    _modlist2.default.find({}, { _id: 1 }, function (err, _modlists) {
      if (err) {
        res.sendStatus(500);
      } else if (_modlists) {
        res.set("Content-Type", "text/plain");
        res.send("" + _modlists.length);
      } else {
        res.sendStatus(404);
      }
    });
  });
  app.get("/api/users/list", function (req, res) {
    _modlist2.default.find({}, { username: 1, timestamp: 1, score: 1 }, function (err, _mods) {
      if (err) {
        res.sendStatus(500);
      } else {
        var mods = [];
        for (var i = _mods.length - 1, j = 0; i >= 0; i--, j++) {
          mods[j] = { "username": _mods[i].username, "score": _mods[i].score, "timestamp": _mods[i].timestamp };
        }
        res.set("Content-Type", "application/json");
        res.json(mods);
      }
    });
  });
}