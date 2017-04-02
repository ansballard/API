const Modlist = require("../models/modlist");

module.exports = function users(app) {
  app.get("/api/users/count", (req, res) => {
    Modlist.find({}, {_id: 1})
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
    .then(mods => {
      res.json(mods.map(({username, score, timestamp}) => ({
        username,
        score,
        timestamp
      })))
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/users/list/:limit", (req, res) => {
    if(!+req.params.limit > 0) {
      res.sendStatus(400);
      return;
    }
    Modlist.find({}, {username: 1, timestamp: 1, score: 1, game: 1})
    .sort({"timestamp": -1})
    .limit(+req.params.limit)
    .exec()
    .then(mods => {
      res.json(mods.map(({username, score, timestamp, game}) => ({
        username,
        score,
        timestamp,
        game: game === "skyrim" ? undefined : game
      })));
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
}
