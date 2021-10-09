import {useState} from 'react';
// import axios from "axios";
import { useRef, useContext } from "react";
import "./register.css";
import { useHistory } from "react-router";
import {Link} from 'react-router-dom';
import {CircularProgress} from "@material-ui/core";
import swal from 'sweetalert';
import { ThemeContext } from "../../components/ThemeProvider";
import { AuthContext } from "../../context/AuthContext";
import { loginCall, ChatAppApi } from "../../apiCalls";
import PasswordChecklist from 'react-password-checklist';

export default function Register() {
  const firstname = useRef();
  const lastname = useRef();
  const username = useRef();
  const email = useRef();
  // const password = useRef();
  // const passwordAgain = useRef();
	const [password, setPassword] = useState("")
	const [passwordAgain, setPasswordAgain] = useState("")
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const state = useContext(ThemeContext);
  const { dispatch } = useContext(AuthContext);

  const convoDesc = {
    color: state.theme.secondary,
  };
  const chatMsgInput = {
    background: state.theme.bgMenuSideBarColor,
    ...convoDesc
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      setLoader(true);
      const user = {
        firstname: firstname.current.value,
        lastname: lastname.current.value,
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await ChatAppApi.post("/auth/register", user).then(res=>{
        setLoader(false);
        swal({
  title: "Good job!",
  text: "You can chat now!",
  icon: "success",
  button: "Continue To Chat Room",
})
.then((value) => {
  loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
});
        }).catch(err=>{
        console.log(err);
          setLoader(false);
          swal({
  title: "Whoops!",
  text: "Something went Wrong!!!",
  icon: "error",
  button: "Try Again",
})
          console.log(err);
        });
      } catch (err) {
        setLoader(false);
        swal({
  title: "Whoops!",
  text: "Something went Wrong!!!",
  icon: "error",
  button: "Try Again",
})
        console.log(err);
      }
    }
  };

  return (
    <div className="login" style={chatMsgInput}>
      <div className="loginWrapper">
        <div className="loginTop">
          <h1 className="loginLogo"><img src="/assets/app-logo.png" alt="app logo" className="loginLogoImg" /> G5 Instant Chat</h1>
          <span className="loginDesc">
            <h4>Sign Up</h4>
            <span>create a new account instantly.</span>
          </span>
        </div>
        <div className="loginFormContainer">
          <form className="loginBox registerSection" style={chatMsgInput} onSubmit={handleClick}>
            <input
              placeholder="FirstName"
              required
              ref={firstname}
              className="loginInput" style={chatMsgInput}
            />
            <input
              placeholder="LastName"
              required
              ref={lastname}
              className="loginInput" style={chatMsgInput}
            />
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput" style={chatMsgInput}
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput" style={chatMsgInput}
              type="email"
            />
            <input
              placeholder="Password"
              required
              onChange={e=> setPassword(e.target.value)}
              className="loginInput" style={chatMsgInput}
              type="password"
            />
            <input
              placeholder="Password Again"
              required
              onChange={e=> setPasswordAgain(e.target.value)}
              className="loginInput" style={chatMsgInput}
              type="password"
            />
            {password !== "" && <PasswordChecklist
				rules={["minLength","specialChar","number","capital","match"]}
				minLength={6}
				value={password}
				valueAgain={passwordAgain}
				onChange={(isValid) => {}}
			/>}
            {!loader ? <button className="loginButton" type="submit" disabled>
              Sign Up
            </button> : <button className="loginButton" type="submit">
              <CircularProgress size={20}/>
            </button>}
              <div className="loginRegisterButton">
                Already have account? <Link to="/login" style={{color: "inherit"}}>
                  Log into Account
                </Link>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}
