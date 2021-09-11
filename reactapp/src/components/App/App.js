import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from "../Dashboard/Dashboard";
import Preferences from "../Preferences/Preferences";
import Login from "../Login/Login";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

async function validateCookie() {
  const sessionId = Cookies.get('sessionId');
  const userId = Cookies.get('userId');

  if (!sessionId || !userId) {
    return false;
  }

  const encodedSession = btoa(`${userId}|${sessionId}`);
  const { isValid, error } = await fetch('http://localhost:9000/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-session': encodedSession,
    },
  }).then(response => response.json());
  if (error) {
    console.log(error);
  }
  return isValid ? true : false;
}


function App() {
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    async function performValidation() {
      const response = await validateCookie()
      setValid(response);
    };
    performValidation().catch(err => console.log(err));
  }, []);

  if (!isValid) {
    return <Login setValid={setValid}/>
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard/>
          </Route>
          <Route path="/preferences">
            <Preferences/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
