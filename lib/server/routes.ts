// const jwt = require("jsonwebtoken");
//
// const Modlist = require("./models/modlist");
// const { tokenEnsureAuthorized } = require("./routes/utils");
//
// const user = require("./routes/user");
// const users = require("./routes/users");
// const upload = require("./routes/upload");
// const script = require("./routes/script");
// const search = require("./routes/search");
// const auth = require("./routes/auth");
// const oauth = require("./routes/oauth");

import { ServerRequest, ServerResponse } from "microrouter";

const { send } = require("micro");
const { get } = require("microrouter");

const usersRoutes = require("./routes/users");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");

module.exports = [
  get("/", (req: ServerRequest, res: ServerResponse) => {
    send(res, 200, "Index!");
  }),
  ...usersRoutes,
  ...userRoutes,
  ...uploadRoutes
];
