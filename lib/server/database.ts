import { Collection, Cursor } from "mongodb";

const { MongoClient } = require("mongodb");

const config = require("../config/db");

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

exports.getUsersList = getUsersList;
async function getUsersList({ limit = 50 }: { limit?: number }): Promise<Cursor> {
  const modlist = await initializeModlistCollection();
  return modlist
    .find({})
    .project({ username: 1, timestamp: 1, score: 1, _id: 0 })
    .sort({ timestamp: -1 })
    .limit(limit)
    .stream();
}

exports.getUsersCount = getUsersCount;
async function getUsersCount(): Promise<number> {
  const modlist = await initializeModlistCollection();
  return modlist.count({});
}

exports.getProfile = getProfile;
async function getProfile({
  username
}: Modwatch.Profile): Promise<Modwatch.Profile | {}> {
  const modlist = await initializeModlistCollection();
  const result = await modlist
    .findOne<Modwatch.Profile>({
      username
    });
  return result || {};
}

async function initializeModlistCollection(): Promise<Collection> {
  return (await client).db("modwatch").collection("modlist");
}
