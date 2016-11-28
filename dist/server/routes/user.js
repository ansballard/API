"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = user;

var _modlist = require("../models/modlist");

var _modlist2 = _interopRequireDefault(_modlist);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function user(app) {
  app.get("/api/user/:username/file/:filetype", function (req, res) {
    if ((0, _utils.validFiletype)(req.params.filetype)) {
      var filetypeJSON = {};
      filetypeJSON[req.params.filetype] = 1;
      _modlist2.default.findOne({ username: req.params.username }, filetypeJSON, function (err, _list) {
        if (err) {
          res.sendStatus(500);
        } else if (!_list) {
          res.sendStatus(404);
        } else {
          _list.shrinkArrays();
          res.json(_list[req.params.filetype]);
        }
      });
    } else {
      res.sendStatus(500);
    }
  });
  app.get("/api/user/:username/rawfile/:filetype", function (req, res) {
    if ((0, _utils.validFiletype)(req.params.filetype)) {
      var filetypeJSON = {};
      filetypeJSON[req.params.filetype] = 1;
      _modlist2.default.findOne({
        username: req.params.username
      }, filetypeJSON, function (err, _list) {
        if (err) {
          res.sendStatus(500);
        } else if (!_list) {
          res.sendStatus(404);
        } else {
          _list.shrinkArrays();
          res.setHeader("Content-Type", "text/plain");
          var textList = [];
          for (var i = 0; i < _list[req.params.filetype].length; i++) {
            textList.push(_list[req.params.filetype][i]);
          }
          res.end(textList.join("\n"));
        }
      });
    } else {
      res.sendStatus(500);
    }
  });
  app.get("/api/user/:username/profile", function (req, res) {
    _modlist2.default.findOne({ username: req.params.username }, { tag: 1, enb: 1, badge: 1, timestamp: 1, game: 1, score: 1, _id: 0 }, function (err, _list) {
      if (err) {
        res.sendStatus(500);
      } else if (!_list) {
        res.sendStatus(404);
      } else {
        res.json(_list);
      }
    });
  });
  app.get("/api/user/:username/files", function (req, res) {
    _modlist2.default.findOne({ username: req.params.username }, { plugins: 1, modlist: 1, ini: 1, prefsini: 1, skse: 1, enblocal: 1, _id: 0 }, function (err, _list) {
      if (err) {
        res.sendStatus(500);
      } else if (!_list) {
        res.sendStatus(404);
      } else {
        var arr = [];
        if (_list.plugins.length > 0) {
          arr.push("plugins");
        }if (_list.modlist.length > 0) {
          arr.push("modlist");
        }if (_list.ini.length > 0) {
          arr.push("ini");
        }if (_list.prefsini.length > 0) {
          arr.push("prefsini");
        }if (_list.skse.length > 0) {
          arr.push("skse");
        }if (_list.enblocal.length > 0) {
          arr.push("enblocal");
        }
        res.json(arr);
      }
    });
  });
  app.post("/api/user/:username/delete", function (req, res) {
    var profileToRemove = _modlist2.default.findOne({ username: req.params.username }, function (err, profile) {
      if (err) {
        res.sendStatus(500);
      } else if (profile && profile.validPassword(req.body.password)) {
        profile.remove(function (removeErr) {
          if (removeErr) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      } else {
        res.sendStatus(403);
      }
    });
  });
  app.post("/api/user/:username/changepass", function (req, res) {
    _modlist2.default.findOne({ "username": req.params.username }, function (err, modlist) {
      if (err) {
        res.sendStatus(500);
      } else if (!modlist || !req.body.newpassword || !req.body.password) {
        console.log(req.body.password, req.body.newpassword);
        res.sendStatus(400);
      } else if (!modlist.validPassword(req.body.password)) {
        res.sendStatus(403);
      } else {
        modlist.password = modlist.generateHash(req.body.newpassword);
        modlist.save(function (err2) {
          res.sendStatus(err2 ? 500 : 200);
        });
      }
    });
  });
}