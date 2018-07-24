import { ServerRequest, ServerResponse } from "microrouter";

const { get } = require("microrouter");
const { send } = require("micro");

const { getUsersCount, getUsersList } = require("../database");
const { serializeStreamToJSONArray } = require("../utils");

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
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        await serializeStreamToJSONArray({
          cursor: users,
          res,
          serializer: (user: Modwatch.Profile) =>
            `{"username":${JSON.stringify(
              user.username
            )},"timestamp":"${user.timestamp.toISOString()}","score":${user.score ||
              0}}`
        });
        res.end();
      } catch (e) {
        console.log(e);
        send(res, 500);
      }
    }
  )
];
