import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import Cookies from 'js-cookie';
import fetcher from "../../utils/Fetcher";

async function attemptLogin(credentials) {
  const res = await fetcher('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  return res;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const res = await attemptLogin({ username, password });
    if (res.authSuccessful) {
      Cookies.set('userId', username);
      Cookies.set('sessionId', res?.sessionId);
      window.location.reload(false);
    } else {
      console.log(res?.error);
    }
  }

  return (
    <div className="Login">
      <Form className="LoginForm" onSubmit={handleSubmit}>
        <Form.Group className="FormItem" size="lg" controlId="email">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="FormItem" size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="LoginButton" size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}