import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import './SignUpForm.css'
import { fetcherWithoutToken } from "../../utils/Fetcher";
import Cookies from 'js-cookie'


export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("2000-01-01");
  const [gender, setGender] = useState("male");

  function validateForm() {
    if (username.length < 3) {
      return false;
    }

    if (password.length < 3) {
      return false;
    }

    if (firstname.length === 0) {
      return false;
    }

    if (lastname.length === 0) {
      return false;
    }

    if (birthday.length === 0) {
      return false;
    }

    if (gender.length === 0) {
      return false;
    }
    return true;
  }

  async function attemptSignUp(event) {
    event.preventDefault();
    const res = await fetcherWithoutToken('/signUp', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        firstname,
        lastname,
        birthday: new Date(birthday).toISOString(),
        gender
      }),
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
      <Form className="SignUpForm">
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
        <Form.Group className="FormItem" size="lg" controlId="password">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="FormItem" size="lg" controlId="password">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="FormItem" size="lg" controlId="password">
          <Form.Label>Birthday</Form.Label>
          <input type="date" value={birthday} min="1950-01-01" max="2021-09-15"
                 onChange={(e) => setBirthday(e.target.value)}/>
        </Form.Group>
        <Form.Group className="FormItem" size="lg" controlId="password">
          <Form.Label>Gender</Form.Label>
          <select onClick={(e) => setGender(e.target.value)} style={{ width: '100%' }}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Form.Group>
      </Form>
      <Button className="LoginButton" size="lg" type="submit" disabled={!validateForm()} onClick={attemptSignUp}>
        Create Account
      </Button>
    </>
  )
}