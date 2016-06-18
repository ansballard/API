"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = upload;

var _modlist2 = require("../modlist");

var _modlist3 = _interopRequireDefault(_modlist2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function upload(app) {
  app.post("/loadorder", function (req, res) {
    _modlist3.default.findOne({ "username": req.body.username }, function (err, _modlist) {
      if (err) {
        res.sendStatus(500);
      } else if (_modlist) {
        // if the username exists in the db
        if (_modlist.validPassword(req.body.password)) {
          if (_modlist.list || _modlist.modlisttxt || _modlist.skyrimini || _modlist.skyrimprefsini) {
            _modlist.list = undefined;
            _modlist.modlisttxt = undefined;
            _modlist.skyrimini = undefined;
            _modlist.skyrimprefsini = undefined;
          }
          _modlist.plugins = req.body.plugins;
          _modlist.modlist = req.body.modlist;
          _modlist.ini = req.body.ini;
          _modlist.prefsini = req.body.prefsini;
          _modlist.skse = req.body.skse;
          _modlist.enblocal = req.body.enblocal;
          _modlist.enb = req.body.enb;
          _modlist.game = req.body.game;
          _modlist.tag = req.body.tag;
          _modlist.timestamp = Date.now();
          _modlist.save(function (saveErr) {
            if (saveErr) {
              res.sendStatus(200);
            } else {
              res.sendStatus(200);
            }
          });
        } else {
          res.status(403);
          res.end("Access denied, incorrect password");
        }
      } else {
        // if the username does not exist
        var modlist = new _modlist3.default();
        modlist.plugins = req.body.plugins;
        modlist.modlist = req.body.modlist;
        modlist.ini = req.body.ini;
        modlist.prefsini = req.body.prefsini;
        modlist.skse = req.body.skse;
        modlist.enblocal = req.body.enblocal;
        modlist.enb = req.body.enb;
        modlist.game = req.body.game;
        modlist.tag = req.body.tag;
        modlist.timestamp = Date.now();
        modlist.username = req.body.username;
        modlist.password = modlist.generateHash(req.body.password);
        modlist.save(function (saveErr) {
          if (saveErr) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });
  app.post("/fullloadorder", function (req, res) {
    _modlist3.default.findOne({ "username": req.body.username }, function (err, _modlist) {
      if (err) {
        res.sendStatus(500);
      } else if (_modlist) {
        // if the username exists in the db
        if (_modlist.validPassword(req.body.password)) {
          _modlist.plugins = _modlist.updateFile(req.body.plugins, "plugins");
          _modlist.modlist = _modlist.updateFile(req.body.modlisttxt, "modlist");
          _modlist.ini = _modlist.updateFile(req.body.skyrimini, "ini");
          _modlist.prefsini = _modlist.updateFile(req.body.skyrimprefsini, "prefsini");
          _modlist.timestamp = Date.now();
          _modlist.save(function (saveErr) {
            if (saveErr) {
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
        } else {
          res.sendStatus(403);
        }
      } else {
        // if the username does not exist
        var modlist = new _modlist3.default();
        modlist.plugins = modlist.updateFile(req.body.plugins, "plugins");
        modlist.modlist = modlist.updateFile(req.body.modlisttxt, "modlist");
        modlist.ini = modlist.updateFile(req.body.skyrimini, "ini");
        modlist.prefsini = modlist.updateFile(req.body.skyrimprefsini, "prefsini");
        modlist.username = req.body.username;
        modlist.password = modlist.generateHash(req.body.password);
        modlist.timestamp = Date.now();
        modlist.save(function (saveErr) {
          if (saveErr) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  });
}