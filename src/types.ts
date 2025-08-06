export type Callback = (err: any, result: any) => void;

export type SafeArgs<T> = [(T | Callback)?, Callback?];
