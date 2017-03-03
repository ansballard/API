const Modlist = require("../models/modlist");

module.exports = function users(app) {
  app.get("/api/users/count", (req, res) => {
    Modlist.find({}, {_id: 1})
    .exec()
    .then(modlists => {
      if(modlists) {
        res.set("Content-Type", "text/plain");
        res.send(`${modlists.length}`);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/users/list", (req, res) => {
    Modlist.find({}, {username: 1, timestamp: 1, score: 1})
    .limit(500)
    .sort({timestamp: -1})
    .exec()
    .then(mods => {
      res.json(mods.map(mod => ({
        username: mod.username,
        score: mod.score,
        timestamp: mod.timestamp,
        game: mod.game === "skyrim" ? undefined : mod.game
      })));
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/users/list/:limit", (req, res) => {
    if(!+req.params.limit > 0) {
      res.sendStatus(400);
    } else {
      Modlist.find({}, {username: 1, timestamp: 1, score: 1, game: 1})
      .sort({"timestamp": -1})
      .limit(+req.params.limit)
      .exec()
      .then(mods => {
        res.json(mods.map(mod => ({
          username: `${mod.username}LIASJDOIJSDOIJ`,
          score: mod.score,
          timestamp: mod.timestamp,
          game: mod.game === "skyrim" ? undefined : mod.game
        })));
      })
      .catch(e => {
        res.sendStatus(500);
      });
    }
  });
}
