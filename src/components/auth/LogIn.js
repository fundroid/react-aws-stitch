import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";
import config from "../../config";
const jwt = require('jsonwebtoken');

class LogIn extends Component {

  state = {
    username: "",
    password: "",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    try {
      const user = await Auth.signIn(this.state.username, this.state.password);
      console.log(user.username);
      // console.log(JSON.stringify(user));
      let jwtString = user.signInUserSession.idToken.jwtToken

      // get payload from aws jwtToken
      var payloadAws = user.signInUserSession.idToken.payload

      // change audience to your stitch client id
      payloadAws.aud = config.stitch.appId

      var jKey = config.stitch.jwtKey
      var signOptions = { algorithm: "HS256" };

      jwtString = jwt.sign(payloadAws, jKey, signOptions);
      console.log("JWToken - " + jwtString)

      // stitch code goes here 
      const {
        Stitch,
        CustomCredential
      } = require('mongodb-stitch-browser-sdk');

      Stitch.initializeDefaultAppClient(config.stitch.appId);// initialize the stitch client

      const credential = new CustomCredential(jwtString);
      Stitch.defaultAppClient.auth.loginWithCredential(credential)
        .then(authedUser => {
            console.log("logged in with STITCH custom auth as user" + authedUser.id)
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);
            this.props.history.push("/");
          })
        .catch(err => console.error("failed to log in with custom auth:" + err))

    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Log in</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter username or email"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default LogIn;