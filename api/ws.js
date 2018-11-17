"use strict";

const { decode, encode } = require("./message");

module.exports = function connection(config, ws) {
  this.config = config;
  this.ws = ws;
  this.isAuthenticated = false;

  ws.on("message", msg => {
    const req = decode(msg);
    switch (req.cmd) {
      case "auth":
        require("./auth").call(this, req);
        break;
      case "ls":
        require("./ls").call(this, req);
        break;
      default:
        ws.send(encode({ success: false }));
    }
  });
};
