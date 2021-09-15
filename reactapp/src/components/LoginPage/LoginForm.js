import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import { fetcherWithoutToken } from "../../utils/Fetcher";
import Cookies from "js-cookie";
import './LoginForm.css'


export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const res = await fetcherWithoutToken('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.success) {
      Cookies.set('userId', username);
      Cookies.set('sessionId', res?.sessionId);
      window.location.reload(false);
    } else {
      console.log(res?.error);
    }
  }


  return (
    <>
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
      </Form>
      <Button className="LoginButton" size="lg" type="submit" disabled={!validateForm()} onClick={handleSubmit}>
        Login
      </Button>
    </>
  )
}