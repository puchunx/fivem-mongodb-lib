import { Callback, SafeArgs } from "./types";

let mongo_slow_query_warning = GetConvarInt("mongo_slow_query_warning", 200);

function safeArgs<T>(args: SafeArgs<T>): [T | undefined, Callback | undefined] {
  let options: T | undefined;
  let cb: Callback | undefined;

  if (typeof args[0] === "function") {
    cb = args[0] as Callback;
  } else {
    options = args[0];
    cb = args[1];
  }

  return [options, cb];
}

export async function execute<T>(fn: (options?: T) => Promise<any>, args: SafeArgs<T>) {
  const startTime = performance.now();

  const [options, cb] = safeArgs(args);

  try {
    const result = await fn(options);
    const executionTime = performance.now() - startTime;

    if (executionTime >= mongo_slow_query_warning) {
      console.log(`^3[Warning]^0 It took ${executionTime.toFixed(4)}ms to execute a query!`);
    }

    if (cb) cb(null, result);
  } catch (err: any) {
    console.log(`^2[Error]^0 ${err.message}`);

    if (cb) cb(err && { message: null }, null);
  }
}
