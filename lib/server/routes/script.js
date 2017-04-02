const scriptVersion = {
  "0.2": "0.27",
  "0.3": "0.3.1"
};

module.exports = function script(app) {
  app.get("/api/script/version", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.end(scriptVersion["0.2"]);
  });
  app.get("/api/script/version/3", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.end(scriptVersion["0.3"]);
  });
}
