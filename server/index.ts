import Parse from "parse/node";
import express from "express";
// const consola = require("consola");
import consola from "consola";
// const { Nuxt, Builder } = require("nuxt");
import { Nuxt, Builder } from "nuxt";

const app = express();
require("dotenv").config();

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;
  app.use("/sitemap.xml", require("./apis/sitemap"));

  // -=-=-=-=-=-=-=- parse init
  const { default: ParseServer } = require("parse-server");
  Parse.initialize(process.env.APP_ID as string, "", process.env.MASTER_KEY);
  const parseServer = new ParseServer({ ...require("./configs/server") });
  const parseServerApi = parseServer.app;
  app.use("/parse", parseServerApi); //  <-- Moved here
  require("./configs/livequery").init(app);
  // -=-=-=-=-=-=-=- parse init

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
