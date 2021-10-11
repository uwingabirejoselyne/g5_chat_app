import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../components/ThemeProvider";

const Login = ({ result }) => {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const state = useContext(ThemeContext);

  const convoDesc = {
    color: state.theme.secondary,
  };
  const chatMsgInput = {
    background: state.theme.bgMenuSideBarColor,
    ...convoDesc,
  };

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="login" style={chatMsgInput}>
      <div className="loginWrapper">
        <div className="loginFormContainer">
          <div className="img-logo">
            <img src="/assets/app-logo.png" alt="app logo" />
          </div>
          <h4>Sign In</h4>
          <form
            className="loginBox"
            style={chatMsgInput}
            onSubmit={handleClick}
          >
            {result.statusCode ? (
              result.statusCode && result.error !== undefined ? (
                <Alert severity="error">
                  Whoops! Username or Password is wrong — try again!
                </Alert>
              ) : (
                <Alert severity="error">
                  Whoops! Something went wrong — try again!
                </Alert>
              )
            ) : (
              ""
            )}
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              style={chatMsgInput}
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              className="loginInput"
              style={chatMsgInput}
              ref={password}
            />
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? <CircularProgress size="20px" /> : "Sign in"}
            </button>
            <div className="loginRegisterButton">
              Don't have account?{" "}
              <Link to="/register" style={{ color: "inherit" }}>
                Create a New Account
              </Link>
            </div>
          </form>
        </div>
        <div className="side-container">
          <img src="/assets/authenticate_side_pic.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
