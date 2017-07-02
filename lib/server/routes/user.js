const Modlist = require("../models/modlist");
const { validFiletype } = require("./utils");

module.exports = function user(app) {
  app.get("/api/user/:username/file/:filetype", (req, res) => {
    if(!validFiletype(req.params.filetype)) {
      res.sendStatus(400);
      return;
    }
    const filetypeJSON = {};
    filetypeJSON[req.params.filetype] = 1;
    Modlist.findOne({username: req.params.username}, filetypeJSON)
    .then(file => {
      if(!file) {
        res.sendStatus(404);
      } else {
        // file.shrinkArrays();
        res.json(file[req.params.filetype]);
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/user/:username/rawfile/:filetype", (req, res) => {
    if (!validFiletype(req.params.filetype)) {
      res.sendStatus(400);
      return;
    }
    const filetypeJSON = {};
    filetypeJSON[req.params.filetype] = 1;
    Modlist.findOne({username: req.params.username}, filetypeJSON)
    .then(rawfile => {
      if (!rawfile) {
        res.sendStatus(404);
      } else {
        // rawfile.shrinkArrays();
        res.setHeader("Content-Type", "text/plain");
        res.end(rawfile[req.params.filetype].join("\n"));
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/user/:username/profile", (req, res) => {
    Modlist.findOne(
      {username: req.params.username},
      {tag: 1, enb: 1, badge: 1, timestamp: 1, game: 1, score: 1, _id: 0}
    )
    .then(profile => {
      if(!profile) {
        res.sendStatus(404);
      } else {
        res.json(profile);
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
    .then(files => {
      if(!files) {
        res.sendStatus(404);
      } else {
        res.json([
          "plugins",
          "modlist",
          "ini",
          "prefsini",
          "skse",
          "enblocal"
        ].filter(type => files[type].length > 0));
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/user/:username/all", (req, res) => {
    const lengthMatch = {
      $elemMatch: {
        $size: { $gt: 0 }
      }
    };
    Modlist.findOne(
      {username: req.params.username},
      {plugins: 1, tag: 1, enb: 1, badge: 1, timestamp: 1, game: 1, score: 1, _id: 0}
    )
    .then(modlist => (
      modlist ? Modlist.aggregate([
        {$match: { username: req.params.username}},
        {$project: {
          plugins: {$ifNull: ["$plugins", []]},
          modlist: {$ifNull: ["$modlist", []]},
          ini: {$ifNull: ["$ini", []]},
          prefsini: {$ifNull: ["$prefsini", []]}
        }},
        {$project: {
          plugins: {$size: "$plugins"},
          modlist: {$size: "$modlist"},
          ini: {$size: "$ini"},
          prefsini: {$size: "$prefsini"},
          _id: 0
        }}
      ]) : Promise.resolve())
      .then(r => (console.log(r), r))
      .then(files => ({
        modlist: modlist ? modlist._doc : undefined,
        files: files ? files[0] : undefined
      }))
    )
    .then(({ modlist, files }) => {
      if(!modlist || !files) {
        res.sendStatus(404);
      } else {
        res.json(Object.assign({files}, modlist));
      }
    })
    .catch(e => {
      console.log(e);
      res.sendStatus(500);
    });
  });
	app.post("/api/user/:username/delete", (req, res) => {
		Modlist.findOne({username: req.params.username})
    .then(profile => {
			if(profile && profile.validPassword(req.body.password)) {
				return profile.remove()
        .then(() => {
					res.sendStatus(200);
				})
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
    .then(modlist => {
      if(!modlist || !req.body.newpassword || !req.body.password) {
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
      res.sendStatus(500);
    });
  })
}
