import { post, ServerRequest, ServerResponse } from "microrouter";
import { send, json } from "micro";

import { uploadProfile } from "../database";
import { getToken } from "../utils";

// /api/user /: username / file /: filetype
// / api / user /: username / rawfile /: filetype
// / api / user /: username / profile
// / api / user /: username / files
// / api / user /: username / all
// / api / user /: username / delete
// /api/user /: username / changepass

module.exports = [
  post("/loadorder", async (req: ServerRequest, res: ServerResponse) => {
    try {
      const body = await json(req) as Modwatch.Profile;
      const profile = {
        ...body,
        timestamp: Date.now()
      };
      send(res, 201, await uploadProfile(profile, getToken(req)));
    } catch(e) {
      console.log(e);
      send(res, e.httpStatus || 500, e.message || null);
    }
  })
];
