"use strict";

import Modlist from "../modlist";

export default function users(app) {
  app.get("/api/users/count", (req, res) => {
    Modlist.find({}, {_id: 1}, (err, _modlists) => {
      if(err) {
        res.sendStatus(500);
      } else if(_modlists) {
        res.set("Content-Type", "text/plain");
        res.send(`${_modlists.length}`);
      } else {
        res.sendStatus(404);
      }
    });
  });
  app.get("/api/users/list", (req, res) => {
    Modlist.find({}, {username: 1, timestamp: 1, score: 1}, (err, _mods) => {
      if(err) {
        res.sendStatus(500);
      } else {
        const mods = [];
        for(let i = _mods.length - 1, j = 0; i >= 0; i--, j++) {
          mods[j] = {"username": _mods[i].username, "score": _mods[i].score, "timestamp": _mods[i].timestamp};
        }
        res.set("Content-Type", "application/json");
        res.json(mods);
      }
    });
  });
}
