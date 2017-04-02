const sanitize = require("mongo-sanitize");
const Modlist = require("../models/modlist");
const { validFiletype } = require("./utils");

module.exports = function search(app) {
  app.get("/api/search/file/:filetype/:querystring", (req, res) => {
		if(!validFiletype(req.params.filetype)) {
      res.sendStatus(400);
      return;
    }
		const query = {};
		query[req.params.filetype] = new RegExp(`.*${sanitize(req.params.querystring)}.*`, "i");
		Modlist.find(query, {username: 1, timestamp: 1, score: 1, game: 1})
    .sort({"timestamp": -1})
    .limit(50)
    .exec()
    .then(users => {
			res.json({
        users: users.map(({username}) => username),
        length: users.length,
        newUsers: users.map(({username, timestamp, score, game}) => ({
          username,
          timestamp,
          score,
          game
        }))
      });
		})
    .catch(e => {
      res.sendStatus(500);
    });
  });
  app.get("/api/search/users/:query/:limit?", (req, res) => {
    if(!req.params.query) {
      res.sendStatus(400);
      return;
    }
    Modlist.find(
      {"username": new RegExp(`.*${sanitize(req.params.query)}.*`, "i")},
      {username: 1, timestamp: 1, score: 1, game: 1}
    )
    .sort({"timestamp": -1})
    .limit(+req.params.limit || 25)
    .exec()
    .then(users => {
      res.json(users.map(({username, timestamp, score, game}) => ({
        username,
        timestamp,
        score,
        game
      })));
    })
    .catch(e => {
      res.sendStatus(500);
    });
  });
}
