import React from "react";
import WS from "./WS";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      password: "",
      directory: "/"
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handleDirectoryChange = this.handleDirectoryChange.bind(this);
    this.handleDirectorySubmit = this.handleDirectorySubmit.bind(this);
  }

  async componentDidMount() {
    let response = await fetch("/config.json");
    if (response.status !== 200) {
      console.error(
        "Looks like there was a problem. Status Code: " + response.status
      );
    } else {
      let data = await response.json();
      this.ws = new WS(`ws://${window.location.hostname}:${data.port}`);
    }
  }

  handlePasswordChange(evt) {
    this.setState({ password: evt.target.value });
  }

  handlePasswordSubmit() {
    if (!this.ws) return;
    this.ws.send({ cmd: "auth", password: this.state.password }, data => {
      if (data.success) this.setState({ isAuthenticated: true });
      else this.setState({ password: "" });
    });
  }

  handleDirectoryChange(evt) {
    this.setState({ directory: evt.target.value });
  }

  handleDirectorySubmit() {
    if (!this.ws) return;
    this.setState({ listing: "" });
    this.ws.send({ cmd: "ls", dir: this.state.directory }, data => {
      let state = {};

      if (data.isForbidden) state.isAuthenticated = false;

      let listing = data.stdout || data.stderr;
      if (listing) state.listing = this.state.listing + listing;

      if (Object.keys(state).length) this.setState(state);
    });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="app">
          <div className="form">
            <div className="form__row">
              <label className="form__row__label" for="password">
                Password:
              </label>
              <input
                className="form__row__input"
                id="password"
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                onKeyDown={evt => {
                  if (evt.keyCode === 13) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.handlePasswordSubmit();
                  }
                }}
              />
            </div>
            <div className="form__row">
              <button
                className="form__row__button"
                onClick={this.handlePasswordSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="form">
          <div className="form__row">
            <label className="form__row__label" for="directory">
              Directory:
            </label>
            <input
              className="form__row__input"
              id="directory"
              type="text"
              value={this.state.directory}
              onChange={this.handleDirectoryChange}
              onKeyDown={evt => {
                if (evt.keyCode === 13) {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.handleDirectorySubmit();
                }
              }}
            />
          </div>
          <div className="form__row">
            <button
              className="form__row__button"
              onClick={this.handleDirectorySubmit}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="output">
          <pre>
            <code>{this.state.listing}</code>
          </pre>
        </div>
      </div>
    );
  }
}

export default App;
