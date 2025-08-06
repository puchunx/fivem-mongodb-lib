# fivem-mongodb-lib

A FiveM library to communicate with a MongoDB using Node Driver.

## Installation

### Configure your server

- Open your server [configuration file](https://docs.fivem.net/docs/server-manual/setting-up-a-server-vanilla/#servercfg).
- Add `start mongodb` to the top of your resource list.
- Configure your mongodb connection string and set it before starting any resources.

```bash
# Be sure to include the database name (e.g. fivem)
set mongo_connection_string "mongodb://root:12345@localhost:27017/fivem"
```

### Slow query warnings

You will receive warnings if a collection operation took a long time to complete, configurable with a convar.

```bash
# default: 200
set mongo_slow_query_warning 150
```

## Usage

### Lua

Modify `fxmanifest.lua` for your resource, and add the following above any other script files.

```lua
server_script '@mongodb/lib/MongoDB.lua'
```
