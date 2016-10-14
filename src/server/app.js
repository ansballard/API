"use strict";

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";

import http from "http";
import path from "path";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import routes from "./routes";
import db from "../config/db";

const app = express();

let configDB;

// if(process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_NODEJS_IP) {
	configDB = db.getNewLive(process.env.DBUSERNAME, process.env.DBPASSWORD);
// } else {
	// configDB = db.getLocal(null, null);
// }

mongoose.connect(configDB);

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
const port = process.env.OPENSHIFT_NODEJS_PORT || 3001;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST"]
};

app.set("port", port);
app.set("ip", ipaddress);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(process.env.OPENSHIFT_NODEJS_IP ? undefined : "dev"));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({secret: process.env.DBEXPRESSSECRET, resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

const scriptVersion = {
  "0.2": "0.27",
  "0.3": "0.3.1"
};

routes(app, jwt, scriptVersion);

http.createServer(app)
.listen(app.get("port"), app.get("ip"), () => {
  console.log(`Express server listening at ${app.get("ip")}:${app.get("port")}`);
});
