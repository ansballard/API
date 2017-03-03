const Modlist = require("../models/modlist");
const { validFiletype } = require("./utils");

module.exports = function user(app) {
  app.get("/api/user/:username/file/:filetype", (req, res) => {
    if(validFiletype(req.params.filetype)) {
      const filetypeJSON = {};
      filetypeJSON[req.params.filetype] = 1;
      Modlist.findOne({username: req.params.username}, filetypeJSON)
      .exec()
      .then(list => {
        if(!list) {
          res.sendStatus(404);
        } else {
          list.shrinkArrays(req.params.filetype);
          res.json(list[req.params.filetype]);
        }
      })
      .catch(e => {
        res.sendStatus(500);
      });
    } else {
      res.sendStatus(400);
    }
  });
  app.get("/api/user/:username/rawfile/:filetype", (req, res) => {
    if (validFiletype(req.params.filetype)) {
      const filetypeJSON = {};
      filetypeJSON[req.params.filetype] = 1;
      Modlist.findOne({username: req.params.username})
      .exec()
      .then(list => {
        if (!list) {
          res.sendStatus(404);
        } else {
          list.shrinkArrays(req.params.filetype);
          res.setHeader("Content-Type", "text/plain");
          res.end(list[req.params.filetype].join("\n"));
        }
      })
      .catch(e => {
        res.sendStatus(500);
      });
    } else {
      res.sendStatus(400);
    }
  });
  app.get("/api/user/:username/profile", (req, res) => {
    Modlist.findOne(
      {username: req.params.username},
      {
        tag: 1, enb: 1, badge: 1, timestamp: 1, game: 1, score: 1,
        plugins: 1, modlist: 1, ini: 1, prefsini: 1, skse: 1, enblocal: 1, _id: 0
      }
    )
    .exec()
    .then(list => {
      if(!list) {
        res.sendStatus(404);
      } else {
        res.json({
          tag: list.tag, enb: list.enb, badge: list.badge, timestamp: list.timestamp, game: list.game, score: list.score,
          files: [
            "plugins",
            "modlist",
            "ini",
            "prefsini",
            "skse",
            "enblocal"
          ].filter(type => list[type].length > 0)
        });
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/user/:username/files", (req, res) => {
    Modlist.findOne(
      {username: req.params.username},
      {plugins: 1, modlist: 1, ini: 1, prefsini: 1, skse: 1, enblocal: 1, _id: 0}
    )
    .exec()
    .then(list => {
      if(!list) {
        res.sendStatus(404);
      } else {
        res.json([
          "plugins",
          "modlist",
          "ini",
          "prefsini",
          "skse",
          "enblocal"
        ].filter(type => list[type].length > 0))
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
	app.post("/api/user/:username/delete", (req, res) => {
		const profileToRemove = Modlist.findOne(
			{username: req.params.username}
    )
    .exec()
    .then(profile => {
      if(profile && profile.validPassword(req.body.password)) {
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
    })
    .catch(e => {
      res.sendStatus(500);
    });
	});
  app.post("/api/user/:username/changepass", (req, res) => {
    Modlist.findOne({"username": req.params.username})
    .exec()
    .then(modlist => {
      if (!modlist || !req.body.newpassword || !req.body.password) {
        res.sendStatus(400);
      } else if (!modlist.validPassword(req.body.password)) {
        res.sendStatus(403);
      } else {
        modlist.password = modlist.generateHash(req.body.newpassword);
        modlist.save(err2 => {
          res.sendStatus(err2 ? 500 : 200);
        });
      }
    })
    .catch(e => {
      res.sendStatus(500)
    });
  })
}
