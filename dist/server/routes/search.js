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
			var filetypeJSON = { username: 1 };
			filetypeJSON[req.params.filetype] = 1;
			_modlist2.default.find({}, filetypeJSON, function (err, users) {
				if (err) {
					res.sendStatus(500);
				} else {
					var toReturn = [];
					var queryLower = req.params.querystring.toLowerCase();
					var fileLower = void 0;
					for (var i = 0; users && i < users.length; i++) {
						users[i].shrinkArrays();
						for (var j = 0; j < users[i][req.params.filetype].length; j++) {
							fileLower = users[i][req.params.filetype][j].toLowerCase();
							if (fileLower.indexOf(queryLower) >= 0) {
								toReturn.push(users[i].username);
								break;
							}
						}
					}
					res.json({ users: toReturn, length: toReturn.length });
				}
			});
		} else {
			res.sendStatus(500);
		}
	});
}