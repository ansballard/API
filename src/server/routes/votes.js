import Modlist from "../models/modlist";
import { tokenEnsureAuthorized } from "./utils";

export default function votes(app, jwt) {
  app.post("/auth/upvote/:votee", tokenEnsureAuthorized, (req, res) => {
		jwt.verify(req.token, process.env.JWTSECRET, (jwtVerifyErr, decoded) => {
			if(jwtVerifyErr) {
				res.status(403);
				res.end("token verification error");
			} else if(decoded.username === req.params.votee) {
				res.status(403);
				res.end("You can't vote for yourself");
			} else if(decoded) {
				Modlist.findOne({"username": decoded.username}, (voterFindErr, voter) => {
					const voterInfo = voter.votedOnUser(req.params.votee);
					if(voter && !voterInfo.upvoted) {
						Modlist.findOne({"username": req.params.votee}, (findVoteeErr, votee) => {
							if(votee) {
								if(voterInfo.index === -1) {
									votee.score += 1;
								} else {
									votee.score += 2;
								}
								votee.save(voteeSaveErr => {
									if(voteeSaveErr) {
										res.status(500);
										res.end("Error saving votee info");
									} else {
										res.json({"score": votee.score});
									}
								});
								if(voterInfo.index !== -1) {
									voter.votedon[voterInfo.index].upvoted = true;
								} else {
									voter.votedon.push({"username": req.params.votee, "upvoted": true});
								}
								voter.save(saveVoterErr => {
									if(saveVoterErr) {
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
						if(!voter) {
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
	app.post("/auth/downvote/:votee", tokenEnsureAuthorized, (req, res) => {
		jwt.verify(req.token, process.env.JWTSECRET, (jwtVerifyErr, decoded) => {
			if(jwtVerifyErr) {
				res.status(403);
				res.end("jwt verification error");
			} else if(decoded.username === req.params.votee) {
				res.status(403);
				res.end("Why would you downvote yourself?");
			} else if(decoded) {
				Modlist.findOne({"username": decoded.username}, (voterFindErr, voter) => {
					const voterInfo = voter.votedOnUser(req.params.votee);
					if(voter && (voterInfo.index === -1 || voterInfo.upvoted)) {
						Modlist.findOne({"username": req.params.votee}, (findVoteeErr, votee) => {
							if(votee) {
								if(voterInfo.index === -1) {
									votee.score -= 1;
								} else {
									votee.score -= 2;
								}
								votee.save(voteeSaveErr => {
									if(voteeSaveErr) {
										res.status(500);
										res.end("Error saving votee info");
									} else {
										res.json({"score": votee.score});
									}
								});
								if(voterInfo.index !== -1) {
									voter.votedon[voterInfo.index].upvoted = false;
								} else {
									voter.votedon.push({"username": req.params.votee, "upvoted": false});
								}
								voter.save(saveVoterErr => {
									if(saveVoterErr) {
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
						if(!voter) {
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
