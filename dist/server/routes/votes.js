"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = votes;

var _modlist = require("../models/modlist");

var _modlist2 = _interopRequireDefault(_modlist);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function votes(app, jwt) {
	app.post("/auth/upvote/:votee", _utils.tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (jwtVerifyErr, decoded) {
			if (jwtVerifyErr) {
				res.status(403);
				res.end("token verification error");
			} else if (decoded.username === req.params.votee) {
				res.status(403);
				res.end("You can't vote for yourself");
			} else if (decoded) {
				_modlist2.default.findOne({ "username": decoded.username }, function (voterFindErr, voter) {
					var voterInfo = voter.votedOnUser(req.params.votee);
					if (voter && !voterInfo.upvoted) {
						_modlist2.default.findOne({ "username": req.params.votee }, function (findVoteeErr, votee) {
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
	app.post("/auth/downvote/:votee", _utils.tokenEnsureAuthorized, function (req, res) {
		jwt.verify(req.token, process.env.JWTSECRET, function (jwtVerifyErr, decoded) {
			if (jwtVerifyErr) {
				res.status(403);
				res.end("jwt verification error");
			} else if (decoded.username === req.params.votee) {
				res.status(403);
				res.end("Why would you downvote yourself?");
			} else if (decoded) {
				_modlist2.default.findOne({ "username": decoded.username }, function (voterFindErr, voter) {
					var voterInfo = voter.votedOnUser(req.params.votee);
					if (voter && (voterInfo.index === -1 || voterInfo.upvoted)) {
						_modlist2.default.findOne({ "username": req.params.votee }, function (findVoteeErr, votee) {
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
}