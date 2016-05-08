"use strict";

import Modlist from "./modlist";
import { tokenEnsureAuthorized } from "./routes/utils";

import user from "./routes/user";
import users from "./routes/users";
import votes from "./routes/votes";
import upload from "./routes/upload";
import script from "./routes/script";
import search from "./routes/search";
import auth from "./routes/auth";

export default routes;

function routes(app, jwt, scriptVersion) {

	user(app);
	users(app);
	votes(app, jwt);
	auth(app, jwt);
	upload(app);
	script(app, scriptVersion);
	search(app);

  app.post("/api/newTag/:username", tokenEnsureAuthorized, (req, res) => {
		jwt.verify(req.token, process.env.JWTSECRET, (err, decoded) => {
			if(err) {
				res.sendStatus(403);
			} else {
				Modlist.findOne({username: req.params.username}, (findErr, _list) => {
					if(_list) {
						_list.tag = req.body.tag;
						_list.save(saveErr => {
							if(saveErr) {
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
	app.post("/api/newENB/:username", tokenEnsureAuthorized, (req, res) => {
		jwt.verify(req.token, process.env.JWTSECRET, (err, decoded) => {
			if(err) {
				res.sendStatus(403);
			} else {
				Modlist.findOne({username: req.params.username}, (findErr, _list) => {
					if(_list) {
						_list.enb = req.body.enb;
						_list.save(saveErr => {
							if(saveErr) {
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
