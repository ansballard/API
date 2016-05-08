"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = script;
function script(app, scriptVersion) {
  app.get("/api/script/version", function (req, res) {
    res.set("Content-Type", "text/plain");
    res.end(scriptVersion["0.2"]);
  });
  app.get("/api/script/version/3", function (req, res) {
    res.set("Content-Type", "text/plain");
    res.end(scriptVersion["0.3"]);
  });
}