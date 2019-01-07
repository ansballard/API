import { MongoClient, Collection } from "mongodb";

import config from "../config/db";
import { generateHash, validPassword, verifyToken, getToken } from "./utils";

const client = MongoClient.connect(
  config({
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    env: process.env.NODE_ENV
  }),
  {
    useNewUrlParser: true
  }
);

export async function getUsersList({ limit = 50 }: { limit?: number }): Promise<Partial<Modwatch.Profile>[]> {
  const modlist = await initializeModlistCollection();
  return modlist
    .find<Modwatch.Profile>({})
    .project({ username: 1, timestamp: 1, score: 1, _id: 0 })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}

export async function getUsersCount(): Promise<number> {
  const modlist = await initializeModlistCollection();
  return modlist.count({});
}

export async function getProfile({
  username
}: {
  username: string
}): Promise<Modwatch.Profile> {
  const modlist = await initializeModlistCollection();
  const result = await modlist
    .findOne<Modwatch.Profile>({
      username
    });
  return result;
}

export async function getProfileFiles({
  username
}: {
  username: string
}) {
  const { plugins, modlist, ini, prefsini } = await (await initializeModlistCollection()).findOne<Modwatch.Profile>(
    { username }
  );
  return {
    plugins: !!plugins && plugins.length > 0,
    modlist: !!modlist && modlist.length > 0,
    ini: !!ini && ini.length > 0,
    prefsini: !!prefsini && prefsini.length > 0
  };
}

export async function uploadProfile(profile: Modwatch.Profile, hash?: string) {
  const modlist = await initializeModlistCollection();
  const exists = await getProfile({ username: profile.username });
  if(!exists) {
    return await modlist.insertOne({
      ...profile,
      password: await generateHash(profile.password)
    });
  } else {
    if((hash && verifyToken(hash)) || !await validPassword(profile.password, exists.password)) {
      throw {
        httpStatus: 401,
        message: "Invalid Login"
      };
    }
    return await modlist.updateOne({
      username: profile.username,
    }, {
      $set: {
        ...profile,
        password: await generateHash(profile.password)
      }
    });
  }
}

export async function searchProfiles(query, limit = 50) {
  const modlist = await initializeModlistCollection();
  return await modlist.find({
    username: {
      $regex: `.*${query}.*`
    }
  })
    .project({ username: 1, timestamp: 1, score: 1, game: 1, _id: 0 })
    .sort({"timestamp": -1})
    .limit(limit)
    .toArray();
}

export async function deleteProfile(username: string, password: string, adminToken?: string) {
  const modlist = await initializeModlistCollection();;
  const exists = await getProfile({ username });
  if (!exists) {
    throw {
      httpStatus: 404,
      message: "Username not found"
    };
  }
  if(!adminToken) {
    if (!await validPassword(password, exists.password)) {
      throw {
        httpStatus: 401,
        message: "Invalid Login"
      };
    }
  } else {
    const token = await verifyToken(adminToken);
    if(!token.roles.includes["admin"]) {
      throw {
        httpStatus: 401,
        message: "Insufficient Permissions"
      };
    }
  }
  return await modlist.deleteOne({
    username
  });
}

export async function changePass(username, oldpass, newpass) {
  const modlist = await initializeModlistCollection();;
  const exists = await getProfile({ username });
  if (!exists) {
    throw {
      httpStatus: 404,
      message: "Username not found"
    };
  }
  if(!await validPassword(oldpass, exists.password)) {
    throw {
      httpStatus: 401,
      message: "Invalid Login"
    };
  }
  return await modlist.updateOne({
    username
  }, {
    $set: {
      password: await generateHash(newpass)
    }
  });
}

export async function initializeModlistCollection(): Promise<Collection> {
  return (await client).db("modwatch").collection("modlist");
}
