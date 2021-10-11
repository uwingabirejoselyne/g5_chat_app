import { useState } from "react";
// import axios from "axios";
import { useRef, useContext } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import swal from "sweetalert";
import { ThemeContext } from "../../components/ThemeProvider";
import { AuthContext } from "../../context/AuthContext";
import { loginCall, ChatAppApi } from "../../apiCalls";
import PasswordChecklist from "react-password-checklist";

export default function Register() {
  const firstname = useRef();
  const lastname = useRef();
  const email = useRef();
  const mobileno = useRef();
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const state = useContext(ThemeContext);
  const { dispatch } = useContext(AuthContext);

  const convoDesc = {
    color: state.theme.secondary,
  };
  const chatMsgInput = {
    background: state.theme.bgMenuSideBarColor,
    ...convoDesc,
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoader(true);
    const user = {
      firstname: firstname.current.value,
      lastname: lastname.current.value,
      username: email.current.value.split("@")[0],
      email: email.current.value,
      mobileno: mobileno.current.value,
      password: password,
    };
    try {
      await ChatAppApi.post("/auth/register", user)
        .then((res) => {
          setLoader(false);
          swal({
            title: "Good job!",
            text: "You can chat now!",
            icon: "success",
            button: "Continue To Chat Room",
          }).then((value) => {
            loginCall(
              {
                email: email.current.value,
                password: password,
              },
              dispatch
            );
          });
        })
        .catch(({ response }) => {
          if (response.status === 400) {
            swal({
              title: "Whoops!",
              text: "Email already exists!!!",
              icon: "error",
              button: "Try Again",
            });
            setLoader(false);
            return;
          }
          setLoader(false);
          swal({
            title: "Whoops!",
            text: "Something went Wrong!!!",
            icon: "error",
            button: "Try Again",
          });
        });
    } catch (err) {
      setLoader(false);
      swal({
        title: "Whoops!",
        text: "Something went Wrong!!!",
        icon: "error",
        button: "Try Again",
      });
      console.log(err);
    }
  };

  const isPasswordValid = (valid) => {
    if (valid) {
      setIsDisabled(false);
      return;
    }
    setIsDisabled(true);
  };

  return (
    <div className="login" style={chatMsgInput}>
      <div className="loginWrapper">
        <div className="loginFormContainer">
          <div className="img-logo">
            <img src="/assets/app-logo.png" alt="app logo" />
          </div>
          <h4>Create account</h4>
          <form
            className="loginBox registerSection"
            style={chatMsgInput}
            onSubmit={handleClick}
          >
            <div className="row-inputs">
              <input
                placeholder="FirstName"
                required
                ref={firstname}
                className="loginInput"
                style={chatMsgInput}
              />
              <input
                placeholder="LastName"
                required
                ref={lastname}
                className="loginInput"
                style={chatMsgInput}
              />
            </div>
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              style={chatMsgInput}
              type="email"
            />
            <input
              placeholder="Mobile Number"
              required
              ref={mobileno}
              className="loginInput"
              style={chatMsgInput}
              type="text"
            />
            <input
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="loginInput"
              style={chatMsgInput}
              type="password"
            />
            <input
              placeholder="Password Again"
              required
              onChange={(e) => setPasswordAgain(e.target.value)}
              className="loginInput"
              style={chatMsgInput}
              type="password"
            />
            {password !== "" && (
              <PasswordChecklist
                rules={[
                  "minLength",
                  "specialChar",
                  "number",
                  "capital",
                  "match",
                ]}
                minLength={6}
                value={password}
                valueAgain={passwordAgain}
                onChange={(isValid) => isPasswordValid(isValid)}
              />
            )}
            {!loader ? (
              <button
                className="loginButton"
                type="submit"
                disabled={isDisabled}
              >
                Sign Up
              </button>
            ) : (
              <button className="loginButton" type="submit" disabled>
                <CircularProgress size={20} />
              </button>
            )}
            <div className="loginRegisterButton">
              Already have account?{" "}
              <Link to="/login" style={{ color: "inherit" }}>
                Log into Account
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
}
