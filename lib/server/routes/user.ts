import { get, post, ServerRequest, ServerResponse } from "microrouter";
import { send, json } from "micro";

import { getProfile, changePass, deleteProfile } from "../database";
import { validFiletype } from "../utils";

export default [
  get("/api/user/:username/file/:filetype", async (req: ServerRequest, res: ServerResponse) => {
    if(!validFiletype(req.params.filetype as Modwatch.FileNames)) {
      send(res, 400, "Invalid Filetype");
    }
    try {
      const profile = await getProfile({ username: req.params.username });
      if(profile[req.params.filetype]) {
        return send(res, 200, profile[req.params.filetype]);
      }
      send(res, 404);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
  get("/api/user/:username/profile", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const profile = await getProfile({ username: req.params.username });
      if(!profile) {
        throw {
          httpStatus: 404,
          message: "Profile Not Found"
        };
      }
      const { timestamp, tag, game, enb, score } = profile;
      send(res, 200, { timestamp, tag, game, enb, score });
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
  get("/api/user/:username/files", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const profile = await getProfile({ username: req.params.username });
      if(!profile) {
        throw {
          httpStatus: 404,
          message: "Profile Not Found"
        };
      }
      send(res, 200, Object.keys(profile).filter(t => validFiletype(t) && profile[t] && profile[t].length > 0));
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
  get("/api/user/:username/all", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const profile = await getProfile({ username: req.params.username });
      if(!profile) {
        throw {
          httpStatus: 404,
          message: "Profile Not Found"
        };
      }
      const { plugins, score, timestamp, game, enb, tag } = profile;
      const files = Object.keys(profile).filter(t => validFiletype(t) && profile[t] && profile[t].length > 0);
      send(res, 200, {
        plugins, score, timestamp, game, enb, tag, files
      });
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
	post("/api/user/:username/delete", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const body = await json(req) as { password: string };
      await deleteProfile(req.params.username, body.password);
      send(res, 200);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
	}),
  post("/api/user/:username/changepass", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const body = await json(req) as { password: string, newpassword: string };
      await changePass(req.params.username, body.password, body.newpassword);
      send(res, 201);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
];
