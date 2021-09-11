import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from "../Dashboard/Dashboard";
import Preferences from "../Preferences/Preferences";
import Login from "../Login/Login";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

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
  const token = getToken();
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    async function func() {
      console.log('USEEFFECT CALLED');
      const response = await validateCookie()
      setValid(response.isValid);
    };

    func().then(r => console.log(r));
  }, [])

  if (!token) {
    if (!isValid) {
      return <Login setToken={setToken}/>
    }
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
