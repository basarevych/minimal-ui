const { encode } = require("./message");

module.exports = function auth(req) {
  let success = false;
  if (this.config.password === req.password) {
    this.isAuthenticated = true;
    success = true;
  }
  this.ws.send(encode({ id: req.id, success }));
};
