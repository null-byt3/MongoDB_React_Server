import React, { useState } from "react";
import "./LoginPage.css";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";


export default function LoginPage() {
  const [isSignUp, setSignUp] = useState(false);

  return (
    <div className="LoginPage">
      {isSignUp ? <SignUpForm/> : <LoginForm/>}
      {isSignUp ?
        <button className="changeButton" onClick={() => setSignUp(false)}>Login</button>
        :
        <button className="changeButton" onClick={() => setSignUp(true)}>Sign Up</button>
      }
    </div>
  );
}