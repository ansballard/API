"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _modlist2 = require("./modlist");

var _modlist3 = _interopRequireDefault(_modlist2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = routes;


var supportedFiletypes = ["plugins", "modlist", "ini", "prefsini", "skse", "enblocal"];

function routes(app, jwt, scriptVersion) {

	/**
  *  Will need routes for option on each when token auth comes in
  */

	app.get("/api/users/count", function (req, res) {
		_modlist3.default.find({}, { _id: 1 }, function (err, _modlists) {
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
		_modlist3.default.find({}, { username: 1, timestamp: 1, score: 1 }, function (err, _mods) {
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
	app.get("/api/script/version", function (req, res) {
		res.set("Content-Type", "text/plain");
		res.end(scriptVersion["0.2"]);
	});
	app.get("/api/script/version/3", function (req, res) {
		res.set("Content-Type", "text/plain");
		res.end(scriptVersion["0.3"]);
	});
	app.get("/api/user/:username/file/:filetype", function (req, res) {
		if (validFiletype(req.params.filetype)) {
			var filetypeJSON = {};
			filetypeJSON[req.params.filetype] = 1;
			_modlist3.default.findOne({ username: req.params.username }, filetypeJSON, function (err, _list) {
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
		if (validFiletype(req.params.filetype)) {
			var filetypeJSON = {};
			filetypeJSON[req.params.filetype] = 1;
			_modlist3.default.findOne({
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
		_modlist3.default.findOne({ username: req.params.username }, { tag: 1, enb: 1, badge: 1, timestamp: 1, game: 1, score: 1, _id: 0 }, function (err, _list) {
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
		_modlist3.default.findOne({ username: req.params.username }, { plugins: 1, modlist: 1, ini: 1, prefsini: 1, skse: 1, enblocal: 1, _id: 0 }, function (err, _list) {
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
	app.get("/api/search/file/:filetype/:querystring", function (req, res) {
		if (validFiletype(req.params.filetype)) {
			var filetypeJSON = { username: 1 };
			filetypeJSON[req.params.filetype] = 1;
			_modlist3.default.find({}, filetypeJSON, function (err, users) {
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

	// app.get("/api/search/timestamp/:from/:to", (req, res) => {
	// 	Modlist.find({}, {username: 1, timestamp: 1}, (err, users) => {
	// 		if(err) {
	// 			res.sendStatus(500);
	// 		} else {
	// 			let toReturn = [];
	// 			for(let i = 0; users && i < users.length; i++) {
	// 				toReturn.push(users[i].timestamp > );
	// 			}
	// 			res.json{users: toReturn, length: toReturn.length});
	// 		}
	// 	});
	// });

	app.post("/auth/checkToken", function (req, res) {
		jwt.verify(req.body.token, process.env.JWTSECRET, function (err, decoded) {
			if (err) {
				res.sendStatus(403);
			} else {
				res.json({ "username": decoded.username });
			}
		});
	});

	app.post("/auth/signin", function (req, res) {
		_modlist3.default.findOne({ "username": req.body.username }, function (err, user) {
			if (err) {
				res.sendStatus(500);
			} else {
				if (user && user.validPassword(req.body.password)) {
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

	app.post("/api/newTag/:username", tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (err, decoded) {
			if (err) {
				res.sendStatus(403);
			} else {
				_modlist3.default.findOne({ username: req.params.username }, function (findErr, _list) {
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
	app.post("/api/newENB/:username", tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (err, decoded) {
			if (err) {
				res.sendStatus(403);
			} else {
				_modlist3.default.findOne({ username: req.params.username }, function (findErr, _list) {
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
	app.post("/auth/upvote/:votee", tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (jwtVerifyErr, decoded) {
			if (jwtVerifyErr) {
				res.status(403);
				res.end("token verification error");
			} else if (decoded.username === req.params.votee) {
				res.status(403);
				res.end("You can't vote for yourself");
			} else if (decoded) {
				_modlist3.default.findOne({ "username": decoded.username }, function (voterFindErr, voter) {
					var voterInfo = voter.votedOnUser(req.params.votee);
					if (voter && !voterInfo.upvoted) {
						_modlist3.default.findOne({ "username": req.params.votee }, function (findVoteeErr, votee) {
							if (votee) {
								if (voterInfo.index === -1) {
									votee.score += 1;
								} else {
									votee.score += 2;
								}
								votee.save(function (voteeSaveErr) {
									if (voteeSaveErr) {
										res.status(500);
										res.end("Error saving votee info");
									} else {
										res.json({ "score": votee.score });
									}
								});
								if (voterInfo.index !== -1) {
									voter.votedon[voterInfo.index].upvoted = true;
								} else {
									voter.votedon.push({ "username": req.params.votee, "upvoted": true });
								}
								voter.save(function (saveVoterErr) {
									if (saveVoterErr) {
										console.log(saveVoterErr);
									} else {
										console.log("Saved voter.votedon");
									}
								});
							} else {
								res.status(404);
								res.end("token verification error");
							}
						});
					} else {
						res.status(403);
						if (!voter) {
							res.end("Voter not found");
						} else {
							res.end("Voter already voted");
						}
					}
				});
			} else {
				res.status(403);
				res.end("Voter not found");
			}
		});
	});
	app.post("/auth/downvote/:votee", tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (jwtVerifyErr, decoded) {
			if (jwtVerifyErr) {
				res.status(403);
				res.end("jwt verification error");
			} else if (decoded.username === req.params.votee) {
				res.status(403);
				res.end("Why would you downvote yourself?");
			} else if (decoded) {
				_modlist3.default.findOne({ "username": decoded.username }, function (voterFindErr, voter) {
					var voterInfo = voter.votedOnUser(req.params.votee);
					if (voter && (voterInfo.index === -1 || voterInfo.upvoted)) {
						_modlist3.default.findOne({ "username": req.params.votee }, function (findVoteeErr, votee) {
							if (votee) {
								if (voterInfo.index === -1) {
									votee.score -= 1;
								} else {
									votee.score -= 2;
								}
								votee.save(function (voteeSaveErr) {
									if (voteeSaveErr) {
										res.status(500);
										res.end("Error saving votee info");
									} else {
										res.json({ "score": votee.score });
									}
								});
								if (voterInfo.index !== -1) {
									voter.votedon[voterInfo.index].upvoted = false;
								} else {
									voter.votedon.push({ "username": req.params.votee, "upvoted": false });
								}
								voter.save(function (saveVoterErr) {
									if (saveVoterErr) {
										console.log(saveVoterErr);
									} else {
										console.log("Saved voter.votedon");
									}
								});
							} else {
								res.status(404);
								res.end("jwt verification error");
							}
						});
					} else {
						res.status(403);
						if (!voter) {
							res.end("Voter not found");
						} else {
							res.end("Voter already voted");
						}
					}
				});
			} else {
				res.status(403);
				res.end("Voter not found");
			}
		});
	});
	app.post("/api/user/:username/delete", function (req, res) {
		var profileToRemove = _modlist3.default.findOne({ username: req.params.username }, function (err, profile) {
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
							res.status(500);
							res.end("Saving to server failed");
						} else {
							res.status(200);
							res.end("Access denied, incorrect password");
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

function validFiletype(filetype) {
	return supportedFiletypes.indexOf(filetype) >= 0;
}

function tokenEnsureAuthorized(req, res, next) {
	var bearerToken = void 0;
	var bearerHeader = req.headers.authorization;
	if (typeof bearerHeader !== "undefined") {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}