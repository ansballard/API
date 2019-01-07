import { get, ServerRequest, ServerResponse } from "microrouter";
import { send } from "micro";

import { getUsersCount, getUsersList, searchProfiles } from "../database";

module.exports = [
  get("/api/users/count", async (req: ServerRequest, res: ServerResponse) => {
    try {
        send(res, 200, await getUsersCount());
    } catch (e) {
      console.log(e);
      send(res, 500);
    }
  }),
  get(
    "/api/users/list(/:limit)",
    async (req: ServerRequest, res: ServerResponse) => {
      if (
        typeof req.params.limit !== "undefined" &&
        !Number.isInteger(+req.params.limit)
      ) {
        send(res, 400, "Invalid Limit");
        return;
      }
      try {
          const users = await getUsersList({
          limit:
            typeof req.params.limit !== "undefined"
              ? +req.params.limit
              : undefined
        });
        send(res, 200, users);
      } catch (e) {
        console.log(e);
        send(res, 500);
      }
    }
  ),
  get("/api/search/users/:query/:limit", async (req: ServerRequest, res: ServerResponse) => {
    const users = await searchProfiles(req.params.query, req.params.limit ? +req.params.limit : undefined);
    send(res, 200, users);
  })
];
