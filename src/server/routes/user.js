"use strict";

import Modlist from "../modlist";
import { validFiletype } from "./utils";

export default function user(app) {
  app.get("/api/user/:username/file/:filetype", (req, res) => {
    if(validFiletype(req.params.filetype)) {
      const filetypeJSON = {};
      filetypeJSON[req.params.filetype] = 1;
      Modlist.findOne({username: req.params.username}, filetypeJSON, (err, _list) => {
        if(err) {
          res.sendStatus(500);
        } else if(!_list) {
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
  app.get("/api/user/:username/rawfile/:filetype", (req, res) => {
    if (validFiletype(req.params.filetype)) {
      const filetypeJSON = {};
      filetypeJSON[req.params.filetype] = 1;
      Modlist.findOne({
        username: req.params.username
      }, filetypeJSON, (err, _list) => {
        if(err) {
          res.sendStatus(500);
        } else if (!_list) {
          res.sendStatus(404);
        } else {
          _list.shrinkArrays();
          res.setHeader("Content-Type", "text/plain");
          const textList = [];
          for(let i = 0; i < _list[req.params.filetype].length; i++) {
            textList.push(_list[req.params.filetype][i]);
          }
          res.end(textList.join("\n"));
        }
      });
    } else {
      res.sendStatus(500);
    }
  });
  app.get("/api/user/:username/profile", (req, res) => {
    Modlist.findOne(
      {username: req.params.username},
      {tag: 1, enb: 1, badge: 1, timestamp: 1, game: 1, score: 1, _id: 0},
      (err, _list) => {
        if(err) {
          res.sendStatus(500);
        } else if(!_list) {
          res.sendStatus(404);
        } else {
          res.json(_list);
        }
      }
    );
  });
  app.get("/api/user/:username/files", (req, res) => {
    Modlist.findOne(
      {username: req.params.username},
      {plugins: 1, modlist: 1, ini: 1, prefsini: 1, skse: 1, enblocal: 1, _id: 0},
        (err, _list) => {
        if(err) {
          res.sendStatus(500);
        } else if(!_list) {
          res.sendStatus(404);
        } else {
          const arr = [];
          if(_list.plugins.length > 0) {
            arr.push("plugins");
          } if(_list.modlist.length > 0) {
            arr.push("modlist");
          } if(_list.ini.length > 0) {
            arr.push("ini");
          } if(_list.prefsini.length > 0) {
            arr.push("prefsini");
          } if(_list.skse.length > 0) {
            arr.push("skse");
          } if(_list.enblocal.length > 0) {
            arr.push("enblocal");
          }
          res.json(arr);
        }
      }
    );
  });
	app.post("/api/user/:username/delete", (req, res) => {
		const profileToRemove = Modlist.findOne(
			{username: req.params.username},
			(err, profile) => {
				if(err) {
					res.sendStatus(500)
				} else if(profile && profile.validPassword(req.body.password)) {
					profile.remove(removeErr => {
						if(removeErr) {
							res.sendStatus(500);
						} else {
							res.sendStatus(200);
						}
					});
				} else {
					res.sendStatus(403);
				}
			}
		);
	});
}
