"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const Promise = require("bluebird")

const http = require("http");
const mongoose = require("mongoose");

const initializeRoutes = require("./routes");

module.exports = ({ connectionString, port, ip, expressSecret, jwtSecret, env}) => {
	const app = express();
	mongoose.Promise = Promise;
	mongoose.connect(connectionString);

	const corsOptions = {
		origin: true,
		methods: ["GET", "POST", "DELETE"]
	};

	app.use(helmet());
	app.use(compression());
	app.use(cors(corsOptions));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(morgan(env === "production" ? undefined : "dev"));
	app.use(cookieParser());
	app.use(session({secret: expressSecret, resave: false, saveUninitialized: false}));
	app.set("view engine", "ejs");

	initializeRoutes(app, {
		jwtSecret,
		env
	});

	app.get("/", (req, res) => {
		res.ContentType = "text/html";
		res.send(`<h1 style="padding-left:20px;">Modwatch API Endpoints</h1>\n<ul style="padding:15px 20px;">${
			app._router.stack
			.filter(r => typeof r.route !== "undefined")
			.map(r => `<li>${r.route.path}</li>`).join("")
		}</ul>`)
		.end();
	});

	return http.createServer(app)
	.listen(port, ip, () => {
		console.log(`Express server listening at ${ip}:${port}`);
	});
}
