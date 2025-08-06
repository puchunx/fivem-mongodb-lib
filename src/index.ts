import { performance } from "perf_hooks";
globalThis.performance = performance as unknown as Performance;

import { db } from "./database";
import { sleep } from "./misc";
import { BSON, BulkWriteOptions, DeleteOptions, Filter, FindOptions, InsertOneOptions, UpdateOptions } from "mongodb";
import { execute } from "./controller";
import { SafeArgs } from "./types";

const MongoDB = {} as Record<string, Function>;

MongoDB.isReady = function () {
  return db ? true : false;
};

MongoDB.awaitConnection = async function () {
  while (!db) await sleep(0);

  return true;
};

MongoDB.collection = function (name: string, options?: object) {
  try {
    const collection = db.collection(name, options);

    return {
      insert: async function (doc: object | object[], ...args: SafeArgs<InsertOneOptions | BulkWriteOptions>) {
        if (Array.isArray(doc)) {
          await execute((options) => collection.insertMany(doc, options), args);
        } else {
          await execute((options) => collection.insertOne(doc, options), args);
        }
      },

      find: async function (filter: Filter<BSON.Document>, ...args: SafeArgs<FindOptions>) {
        await execute((options) => collection.find(filter, options).toArray(), args);
      },

      findOne: async function (filter: Filter<BSON.Document>, ...args: SafeArgs<FindOptions>) {
        await execute((options) => collection.findOne(filter, options), args);
      },

      delete: async function (filter: Filter<BSON.Document>, ...args: SafeArgs<DeleteOptions>) {
        await execute((options) => collection.deleteMany(filter, options), args);
      },

      update: async function (filter: Filter<BSON.Document>, update: object, ...args: SafeArgs<UpdateOptions>) {
        await execute((options) => collection.updateMany(filter, update, options), args);
      },
    };
  } catch (err: any) {
    return console.log(`^2[Error]^0 ${err.message}`);
  }
};

for (const key in MongoDB) {
  const exp = MongoDB[key];

  if (exp) {
    global.exports(`${key}`, exp);
  }
}
