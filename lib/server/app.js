"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

const http = require("http");
const { join } = require("path");
const mongoose = require("mongoose");

const routes = require("./routes");
const db = require("../config/db");

const app = express();

let configDB;

if(process.env.OPENSHIFT_NODEJS_PORT && process.env.OPENSHIFT_NODEJS_IP) {
	configDB = db.getNewLive(process.env.DBUSERNAME, process.env.DBPASSWORD);
} else {
	configDB = db.getLocal();
}

mongoose.connect(configDB);

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
const port = process.env.OPENSHIFT_NODEJS_PORT || 3001;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST"]
};

app.set("port", port);
app.set("ip", ipaddress);
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(morgan(process.env.OPENSHIFT_NODEJS_IP ? undefined : "dev"));
app.use(methodOverride());
app.use(express.static(join(__dirname, "public")));
app.use(cors(corsOptions));

routes({app});

http.createServer(app)
.listen(app.get("port"), app.get("ip"), () => {
  console.log(`Express server listening at ${app.get("ip")}:${app.get("port")}`);
});
