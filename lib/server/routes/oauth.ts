import { post, del, get, ServerRequest, ServerResponse } from "microrouter";
import { send, json } from "micro";
import { join } from "path";
import { renderFile } from "ejs";
import { promisify } from "util";
import { encode } from "jwt-simple";

import { getToken, serialize, verifyToken, validPassword } from "../utils";
import { getProfile, deleteProfile } from "../database";

const renderFileAsync = promisify(renderFile);

const clients = [
  "https://modwat.ch",
  "http://local.modwat.ch",
  "https://modwatch-staging.firebaseapp.com"
];

export default [
  get("/oauth/authorize", async (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, await renderFileAsync(join(__dirname, "..", "oauth.ejs"), {
      params: req.query,
      querystring: serialize(req.query)
    }));
  }),
  get("/oauth/verify", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const token = await verifyToken(await getToken(req));
      if (new Date() > new Date(token.exp)) {
        throw {
          httpStatus: 401,
          message: "Invalid Token"
        }
      }
      send(res, 200);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  }),
  post("/oauth/authorize", async (req: ServerRequest, res: ServerResponse) => {
    const query = serialize(req.query);
    try {
      const body = await json(req) as Modwatch.Profile;
      const scopes = body.scopes || [];
      if (clients.every(c => req.query.redirect_uri.indexOf(c) !== 0)) {
        res.statusCode = 301;
        res.setHeader('Location', `/oauth/authorize?${query}&failed=${encodeURIComponent("Login must be initiated from a valid client")}`);
        res.end();
        return;
      }
      if (["username", "password"].filter(q => !!body[q]).length !== 2) {
        res.statusCode = 301;
        res.setHeader('Location', `/oauth/authorize?${query}&failed=${encodeURIComponent("Username/Password/Scope Required")}`);
        res.end();
        return;
      }
      const profile = await getProfile({ username: body.username });
      if(
        !await validPassword(body.password, profile.password) ||
        scopes.filter(s => (profile.roles || []).includes(s)).length === scopes.length
      ) {
        throw {
          httpStatus: 401,
          message: "Invalid Login"
        };
      }
      const iat = new Date().getTime();
      const token = {
        iss: req.query.redirect_uri,
        aud: "https://api.modwat.ch/",
        sub: profile.username,
        iat,
        exp: iat + (3600 * 1000),
        scopes: [...new Set(["user"].concat(scopes).concat(profile.roles))]
      };
      res.statusCode = 301;
      res.setHeader('Location', `${decodeURIComponent(req.query.redirect_uri)}oauth/access_token/${encodeURIComponent(encode(token, process.env.JWTSECRET))}/token_type/Bearer/expires_in/3600`);
          res.end();
    } catch(e) {
      console.log(e);
      res.statusCode = 301;
      res.setHeader('Location', `/oauth/authorize?${query}&failed=${encodeURIComponent("Invalid Credentials")}`);
      res.end();
    }
  }),
  del("/oauth/user/:username/delete", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const token = await verifyToken(await getToken(req));
      if (req.params.username !== token.sub && !token.scopes.includes("admin")) {
        send(res, 401);
        return;
      }
      const profile = await getProfile({ username: req.params.usernam });
      if (
        profile.roles.includes("admin")
      ) {
        send(res, 401);
        return;
      }
      await deleteProfile(req.params.username, null, token);
      send(res, 200);
    } catch (e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  })
];
