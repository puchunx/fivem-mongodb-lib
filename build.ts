import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  outfile: "dist/build.js",
  bundle: true,
  legalComments: "inline",
  platform: "node",
  target: ["node22"],
  format: "cjs",
  logLevel: "info",
  minify: true,
});
