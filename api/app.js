"use strict";

const path = require("path");
const express = require("express");
const error = require("./error");

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

let appHost = process.env.APP_HOST || "0.0.0.0";
let appPort = parseInt(process.env.APP_PORT, 10) || 3000;
let rootLogin = process.env.ROOT_LOGIN;
let rootPassword = process.env.ROOT_PASSWORD;

/**
 * The application
 */
class App {
  /**
   * Constructor
   */
  constructor(root) {
    this.config = {
      root,
      appHost,
      appPort,
      rootLogin,
      rootPassword
    };

    this.express = express();
    this.express.set("port", this.config.appPort);
  }

  async init({ server }) {
    this.server = server;

    this.express.use(
      express.static(path.join(this.config.root, "front"), {
        maxAge: "10d"
      })
    );

    this.express.use((req, res, next) => {
      let error = new Error("Not Found");
      error.status = 404;
      next(error);
    });
    this.express.use(error(this));
  }
}

module.exports = App;
