"use strict";

const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

const root = path.join.bind(path, path.resolve(__dirname));
process.chdir(root());

let config;
try {
  config = require(root("config.js"));
} catch (unused) {
  config = require(root("config.js.example"));
}

fs.writeFileSync(
  root("front", "config.json"),
  JSON.stringify({ port: config.port })
);

const wss = new WebSocket.Server({ host: config.host, port: config.port });
wss.on("connection", require("./api/ws").bind({}, config));
