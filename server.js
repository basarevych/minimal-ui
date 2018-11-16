"use strict";

const http = require("http");
const path = require("path");
const App = require("./api/app");

const root = path.join.bind(path, path.resolve(__dirname));
process.chdir(root());

let app = new App(root());
let server = http.createServer(app.express);

app
  .init({ server })
  .then(() => {
    server.listen(app.config.appPort, app.config.appHost);
    server.on("error", onError);
    server.once("listening", onListening);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error
 */
function onError(error) {
  if (error.syscall !== "listen") throw error;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${app.config.appPort} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${app.config.appPort} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let address = server.address();
  console.log(`> Server is listening on ${address.address}:${address.port}`);
}
