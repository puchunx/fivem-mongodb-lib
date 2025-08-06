import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { sleep } from "./misc";

export let db: Db;

const mongo_connection_string = GetConvar("mongo_connection_string", "");

const client = new MongoClient(mongo_connection_string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function createConnectionPool() {
  try {
    await client.connect();

    db = client.db();
  } catch (err: any) {
    console.log(`^3Unable to establish a connection to the MongoDB server!\n^1Error: ${err.message}^0`);
  }
}

setTimeout(async () => {
  while (!db) {
    await createConnectionPool();

    if (!db) await sleep(30000);
  }
});
