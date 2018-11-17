import uuid from "uuid";

export default class WS {
  constructor(url) {
    this.requests = {};
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.onMessage.bind(this);
  }

  send(req, onData) {
    const id = uuid.v4();
    req.id = id;
    this.requests[id] = { onData };
    this.ws.send(JSON.stringify(req));
  }

  onMessage(evt) {
    let data = JSON.parse(evt.data);
    let req = this.requests[data.id];
    if (req) {
      req.onData(data);
      if (typeof data.success !== "undefined") delete this.requests[data.id];
    }
  }
}
