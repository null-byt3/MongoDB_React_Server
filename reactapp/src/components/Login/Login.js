import React, { useState } from 'react';
import './Login.css';
import Cookies from 'js-cookie';


type Props = {
  setToken: any
}


async function attemptLogin(credentials) {
  const res = await fetch('http://localhost:9000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(response => response.json());
  return res;
}


export default function Login({ setToken }: Props) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const { authSuccessful, sessionId, error } = await attemptLogin({ username, password });
    if (authSuccessful) {
      Cookies.set('userId', username);
      Cookies.set('sessionId', sessionId);
    }
  }


  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}