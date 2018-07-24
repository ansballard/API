import { ServerRequest, ServerResponse } from "microrouter";

const { get } = require("microrouter");
const { send } = require("micro");

const { getProfile } = require("../database");
const { supportedFiletypes } = require("./utils");

// /api/user /: username / file /: filetype
// / api / user /: username / rawfile /: filetype
// / api / user /: username / profile
// / api / user /: username / files
// / api / user /: username / all
// / api / user /: username / delete
// /api/user /: username / changepass

module.exports = [
  get("/api/user/:username/file/:filetype", async (req: ServerRequest, res: ServerResponse) => {
    if(!validFiletype(req.params.filetype)) {
      send(res, 400, "Invalid Filetype");
    }
    try {
      const profile = await getProfile(req.params);
      if(profile[req.params.filetype]) {
        return send(res, 200, profile[req.params.filetype]);
      }
      send(res, 404);
    } catch (e) {
      console.log(e);
      send(res, 500);
    }
  }),
  get("/api/user/:username/profile", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const { timestamp, tag, game, enb, score } = await getProfile(req.params);
      if(timestamp) {
        return send(res, 200, { timestamp, tag, game, enb, score });
      }
      send(res, 404);
    } catch (e) {
      console.log(e);
      send(res, 500);
    }
  }),
  get("/api/user/:username/files", async (req: ServerRequest, res: ServerResponse) => {
    const keys = Object.keys(await getProfile(req.params)).filter(key => ;
    try {
      send(res, 200, await getProfile(req.params));
    } catch (e) {
      console.log(e);
      send(res, 500);
    }
  }),
  get("/api/user/:username/all", async (req: ServerRequest, res: ServerResponse) => {
    try {
      send(res, 200, await getProfile(req.params));
    } catch (e) {
      console.log(e);
      send(res, 500);
    }
  })
];
