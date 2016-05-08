"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _methodOverride = require("method-override");

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _db = require("../config/db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var configDB = void 0;

if (process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_NODEJS_IP) {
  configDB = _db2.default.getNewLive(process.env.DBUSERNAME, process.env.DBPASSWORD);
} else {
  configDB = _db2.default.getLocal(null, null);
}

_mongoose2.default.connect(configDB);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3001;

var corsOptions = {
  origin: true,
  methods: ["GET", "POST"]
};

app.set("port", port);
app.set("ip", ipaddress);
app.set("views", _path2.default.join(__dirname, "views"));
app.set("view engine", "html");
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _morgan2.default)(process.env.OPENSHIFT_NODEJS_IP ? undefined : "dev"));
app.use((0, _methodOverride2.default)());
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({ secret: process.env.DBEXPRESSSECRET, resave: false, saveUninitialized: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, "public")));
app.use((0, _cors2.default)(corsOptions));

var scriptVersion = {
  "0.2": "0.27",
  "0.3": "0.3.1"
};

(0, _routes2.default)(app, _jsonwebtoken2.default, scriptVersion);

_http2.default.createServer(app).listen(app.get("port"), app.get("ip"), function () {
  console.log("Express server listening at " + app.get("ip") + ":" + app.get("port"));
});