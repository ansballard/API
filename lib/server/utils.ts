import { Cursor } from "mongodb";
import { ServerResponse, ServerRequest } from "microrouter";

import { decode, encode } from "jwt-simple";
import bcrypt from "bcrypt-nodejs";
import { promisify } from "util";
import { getProfile } from "./database";

const compareAsync = promisify(bcrypt.compare);
const hashAsync = promisify(bcrypt.hash);
const genSaltAsync = promisify(bcrypt.genSalt);

// exports.tokenEnsureAuthorized = function(req, res, next) {
// 	let bearerToken;
// 	const bearerHeader = req.headers.authorization;
// 	if (typeof bearerHeader !== "undefined") {
// 		const bearer = bearerHeader.split(" ");
// 		bearerToken = bearer[1];
// 		req.token = bearerToken;
// 		next();
// 	} else {
// 		res.sendStatus(403);
// 	}
// }

export const supportedFiletypes: Modwatch.FileNames[] = [
  "plugins",
  "modlist",
  "ini",
  "prefsini"
];

export function validFiletype(
  filetype: string
): boolean {
  //@ts-ignore supportedFiletypes is strings, whatever
  return supportedFiletypes.includes(filetype);
};

export async function generateHash(_password: string): Promise<string> {
  return await hashAsync(_password, await genSaltAsync(8), null);
};

export async function validPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await compareAsync(password, hash);
  } catch (e) {
    return false;
  }
};

export function getToken(req: ServerRequest): string {
  try {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader === "undefined") {
      return undefined;
    }
    const bearer = bearerHeader.split(" ");
    return bearer[1];
  } catch(e) {
    console.log(e);
    throw {
      httpStatus: 401,
      message: "Invalid Token"
    }
  }
}

export function serialize(query: object): string {
  return Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join("&");
}

export async function generateToken(username: string, password: string): Promise<string> {
  const profile = await getProfile({ username });
  if(!profile) {
    throw {
      httpStatus: 404,
      message: "Profile Not Found"
    };
  }
  if(!await validPassword(profile.password, password)) {
    throw {
      httpStatus: 401,
      message: "Invalid Login"
    };
  }
  return encode({ username }, process.env.JWT_SECRET);
};

export function verifyToken(token: string): any {
  try {
    const decoded = decode(token, process.env.JWT_SECRET);
    if(!decoded || !decoded.username) {
      throw {
        httpStatus: 401,
        message: "Invalid Token"
      };
    }
    return decoded;
  } catch(e) {
    console.log(e);
    throw {
      httpStatus: 401,
      message: "Invalid Token"
    };
  }
};

exports.serializeStreamToJSONArray = function serializeStreamToJSONArray({
  cursor,
  res,
  serializer
}: SerializeStreamToJSONParameters): Promise<number> {
  return new Promise((resolve, reject) => {
    res.write("[");
    let first = true;
    let count = 0;
    cursor.on("readable", () => {
      let item = null;
      //@ts-ignore @type def is wrong, read() can take null
      while ((item = cursor.read()) !== null) {
        count++;
        if (!first) {
          res.write(",");
        } else {
          first = false;
        }
        res.write(serializer(item));
      }
    });
    cursor.on("end", () => {
      res.write("]");
      resolve(count);
    });
    cursor.on("error", (e: Error) => {
      throw e;
    });
  });
};

interface SerializeStreamToJSONParameters {
  cursor: Cursor;
  res: ServerResponse;
  serializer(object: any): string;
}
