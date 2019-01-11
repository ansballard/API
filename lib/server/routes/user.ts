import { get, post, ServerRequest, ServerResponse } from "microrouter";
import { send, json } from "micro";
import UrlPattern from "url-pattern";

import { getProfile, changePass, deleteProfile } from "../database";
import { validFiletype, getToken, usernameRegex } from "../utils";

export const routes = [
  //@ts-ignore UrlPattern is allowed as a parameter to micro-router methods
  get(new UrlPattern("/api/user/:username/file/:filetype", usernameRegex), async (req: ServerRequest, res: ServerResponse) => {
    if(!validFiletype(req.params.filetype as Modwatch.FileNames)) {
      send(res, 400, "Invalid Filetype");
    }
    try {
      const profile = await getProfile({ username: decodeURIComponent(req.params.username) });
      if(!profile) {
        throw {
          httpStatus: 404,
          message: "Profile Not Found"
        };
      }
      if(profile[req.params.filetype]) {
        send(res, 200, profile[req.params.filetype]);
        return;
      }
      throw {
        httpStatus: 404,
        message: "Filetype Not Found"
      };
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
  //@ts-ignore UrlPattern is allowed as a parameter to micro-router methods
  get(new UrlPattern("/api/user/:username/profile", usernameRegex), async (req: ServerRequest, res: ServerResponse) => {
    try {
      const profile = await getProfile({ username: decodeURIComponent(req.params.username) });
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
  //@ts-ignore UrlPattern is allowed as a parameter to micro-router methods
  get(new UrlPattern("/api/user/:username/files", usernameRegex), async (req: ServerRequest, res: ServerResponse) => {
    try {
      const profile = await getProfile({ username: decodeURIComponent(req.params.username) });
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
  //@ts-ignore UrlPattern is allowed as a parameter to micro-router methods
  get(new UrlPattern("/api/user/:username/all", usernameRegex), async (req: ServerRequest, res: ServerResponse) => {
    try {
      const profile = await getProfile({ username: decodeURIComponent(req.params.username) });
      if(!profile) {
        throw {
          httpStatus: 404,
          message: "Profile Not Found"
        };
      }
      const { plugins, score, timestamp, game, enb, tag } = profile;
      const files = {};
      for(const f of ["plugins", "modlist", "ini", "prefsini"]) {
        files[f] = !profile[f] ? 0 : profile[f].length
      }
      // const files = Object.keys(profile).filter(t => validFiletype(t) && profile[t] && profile[t].length > 0);
      send(res, 200, {
        plugins, score, timestamp, game, enb, tag, files
      });
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
  //@ts-ignore UrlPattern is allowed as a parameter to micro-router methods
	post(new UrlPattern("/api/user/:username/delete", usernameRegex), async (req: ServerRequest, res: ServerResponse) => {
    try {
      const body = await json(req) as { password: string };
      await deleteProfile(decodeURIComponent(req.params.username), body.password, await getToken(req));
      send(res, 200);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
	}),
  //@ts-ignore UrlPattern is allowed as a parameter to micro-router methods
  post(new UrlPattern("/api/user/:username/changepass", usernameRegex), async (req: ServerRequest, res: ServerResponse) => {
    try {
      const body = await json(req) as { password: string, newpassword: string };
      await changePass(decodeURIComponent(req.params.username), body.password, body.newpassword);
      send(res, 201);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
];
