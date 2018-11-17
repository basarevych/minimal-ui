const { encode } = require("./message");
const { spawn } = require("child_process");

module.exports = function ls(req) {
  if (!this.isAuthenticated) {
    return this.ws.send(
      encode({ id: req.id, success: false, isForbidden: true })
    );
  }

  if (!req.dir) return this.ws.send(encode({ id: req.id, success: false }));

  const ls = spawn("ls", ["-lah", req.dir]);

  ls.stdout.on("data", data =>
    this.ws.send(encode({ id: req.id, stdout: data.toString() }))
  );

  ls.stderr.on("data", data => {
    this.ws.send(encode({ id: req.id, stderr: data.toString() }));
  });

  ls.on("close", code => {
    this.ws.send(encode({ id: req.id, success: true, code }));
  });
};
