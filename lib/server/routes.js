const jwt = require("jsonwebtoken");

const Modlist = require("./models/modlist");
const { tokenEnsureAuthorized } = require("./routes/utils");

const user = require("./routes/user");
const users = require("./routes/users");
// const votes = require("./routes/votes");
const upload = require("./routes/upload");
const script = require("./routes/script");
const search = require("./routes/search");
const auth = require("./routes/auth");

module.exports = routes;

function routes(app, scriptVersion) {

	user(app);
	users(app);
	// votes(app);
	auth(app);
	upload(app);
	script(app, scriptVersion);
	search(app);

	app.get("/", (req, res) => {
		res.end("<h1>Modwatch JSON API</h1>");
	});

	app.get("/health", (req, res) => {
		res.sendStatus(200);
	});

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
