"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _modlist = require("./modlist");

var _modlist2 = _interopRequireDefault(_modlist);

var _utils = require("./routes/utils");

var _user = require("./routes/user");

var _user2 = _interopRequireDefault(_user);

var _users = require("./routes/users");

var _users2 = _interopRequireDefault(_users);

var _votes = require("./routes/votes");

var _votes2 = _interopRequireDefault(_votes);

var _upload = require("./routes/upload");

var _upload2 = _interopRequireDefault(_upload);

var _script = require("./routes/script");

var _script2 = _interopRequireDefault(_script);

var _search = require("./routes/search");

var _search2 = _interopRequireDefault(_search);

var _auth = require("./routes/auth");

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = routes;


function routes(app, jwt, scriptVersion) {

	(0, _user2.default)(app);
	(0, _users2.default)(app);
	(0, _votes2.default)(app, jwt);
	(0, _auth2.default)(app, jwt);
	(0, _upload2.default)(app);
	(0, _script2.default)(app, scriptVersion);
	(0, _search2.default)(app);

	app.get("/health", function (req, res) {
		res.sendStatus(200);
	});

	app.post("/api/newTag/:username", _utils.tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (err, decoded) {
			if (err) {
				res.sendStatus(403);
			} else {
				_modlist2.default.findOne({ username: req.params.username }, function (findErr, _list) {
					if (_list) {
						_list.tag = req.body.tag;
						_list.save(function (saveErr) {
							if (saveErr) {
								res.sendStatus(500);
							} else {
								res.sendStatus(200);
							}
						});
					} else {
						res.sendStatus(404);
					}
				});
			}
		});
	});
	app.post("/api/newENB/:username", _utils.tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (err, decoded) {
			if (err) {
				res.sendStatus(403);
			} else {
				_modlist2.default.findOne({ username: req.params.username }, function (findErr, _list) {
					if (_list) {
						_list.enb = req.body.enb;
						_list.save(function (saveErr) {
							if (saveErr) {
								res.sendStatus(500);
							} else {
								res.sendStatus(200);
							}
						});
					} else {
						res.sendStatus(404);
					}
				});
			}
		});
	});
}