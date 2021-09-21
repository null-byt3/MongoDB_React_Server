import React, { useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import './Preferences.css'
import { fetcher } from "../../utils/Fetcher";
import Button from "react-bootstrap/Button";
import _ from "lodash";

export default function Preferences() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("2000-01-01");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    async function fetchPreferences() {
      const { success, error, userData } = await fetcher('/preferences', {
        method: 'GET'
      });
      if (success) {

        const formattedBirthday = userData.birthday.split('T')[0];
        setOriginalData({ ...userData, birthday: formattedBirthday });
        setUsername(userData.username);
        setPassword(userData.password);
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setBirthday(formattedBirthday);
        setMaritalStatus(userData.maritalStatus);

      } else {
        console.log(error);
      }
    }

    fetchPreferences().catch(err => console.log(err));
  }, [])

  async function updateUserData(event) {
    event.preventDefault();
    const res = await fetcher('/preferences', {
      method: 'POST',
      body: JSON.stringify({
        password,
        firstname,
        lastname,
        birthday: new Date(birthday).toISOString(),
        maritalStatus
      }),
    });
    if (res?.success) {
      window.location.reload(false);
    } else {
      console.log(res?.error);
    }
  }

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

    if (maritalStatus.length === 0) {
      return false;
    }

    if (_.isEqual({ username, password, firstname, lastname, birthday, maritalStatus }, originalData)) {
      return false;
    }
    return true;
  }

  return (
    <>
      <div className="title">
        <div className="titleText">Preferences</div>
      </div>
      <div className="PreferencesBody">
        <Form className="PreferencesContainer">
          <Form.Group className="FormItem" size="lg" controlId="email">
            <Form.Label style={{ marginRight: '20px' }}>Username: </Form.Label>
            <Form.Control
              autoFocus
              plaintext
              readOnly
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="FormItem" size="lg" controlId="password">
            <Form.Label style={{ marginRight: '20px' }}>Password: </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="FormItem" size="lg" controlId="password">
            <Form.Label style={{ marginRight: '20px' }}>First Name: </Form.Label>
            <Form.Control
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="FormItem" size="lg" controlId="password">
            <Form.Label style={{ marginRight: '20px' }}>Last Name: </Form.Label>
            <Form.Control
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="FormItem" size="lg" controlId="password">
            <Form.Label style={{ marginRight: '20px' }}>Birthday: </Form.Label>
            <input type="date" value={birthday} min="1950-01-01" max="2021-09-15"
                   onChange={(e) => setBirthday(e.target.value)}/>
          </Form.Group>
          <Form.Group className="FormItem" size="lg" controlId="password">
            <Form.Label style={{ marginRight: '20px' }}>Marital Status: </Form.Label>
            <select onClick={(e) => setMaritalStatus(e.target.value)}>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </Form.Group>
        </Form>
        <Button className="UpdateButton" size="lg" type="submit" disabled={!validateForm()}
                onClick={updateUserData}>
          Update account
        </Button>
      </div>
    </>
  )
}