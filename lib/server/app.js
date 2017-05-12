"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");

const http = require("http");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const routes = require("./routes");
const db = require("../config/db");

const app = express();

let configDB;

if(process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_NODEJS_IP) {
	configDB = db.getNewLive(process.env.DBUSERNAME, process.env.DBPASSWORD);
} else {
	configDB = db.getLocal();
}

mongoose.Promise = require("bluebird");
mongoose.connect(configDB);

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || "localhost";
const port = process.env.OPENSHIFT_NODEJS_PORT || 3001;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST"]
};

app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(process.env.OPENSHIFT_NODEJS_IP ? undefined : "dev"));
app.use(cookieParser());
app.use(session({secret: process.env.DBEXPRESSSECRET, resave: false, saveUninitialized: false}));
app.set("view engine", "ejs");

routes(app);

app.get("/", (req, res) => {
	res.ContentType = "text/html";
	res.send(`<h1 style="padding-left:20px;">Modwatch API Endpoints</h1>\n<ul style="padding:15px 20px;">${
		app._router.stack
		.filter(r => typeof r.route !== "undefined")
		.map(r => `<li>${r.route.path}</li>`).join("")
	}</ul>`)
	.end();
});

http.createServer(app)
.listen(port, ipaddress, () => {
  console.log(`Express server listening at ${ipaddress}:${port}`);
});
