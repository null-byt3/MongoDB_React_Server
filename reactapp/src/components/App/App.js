import './App.css';
import Login from "../Login/Login";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Expenses from "../Expenses/Expenses";
import Preferences from "../Preferences/Preferences";
import Reports from "../Reports/Reports";
import Button from "react-bootstrap/Button";
import fetcher from "../../utils/Fetcher";

async function validateCookie() {
  const { isValid, error } = await fetcher('/login', { method: 'GET' })
  if (error) {
    console.log(error);
  }
  return isValid ? true : false;
}


function App() {
  const [isValid, setValid] = useState(undefined);

  useEffect(() => {
    async function performValidation() {
      const response = await validateCookie()
      setValid(response);
    };
    performValidation().catch(err => console.log(err));
  }, []);

  if (isValid === undefined) {
    return <></>
  }

  if (isValid === false) {
    return <Login setValid={setValid}/>
  }

  return (
    <div className="background">
      <BrowserRouter>
        <div className="d-flex wrapper">
          <div className="ProjectHeader">MongoDB Project</div>
          <Link to="/expenses" className="btn btn-secondary"
                style={{ textDecoration: 'none' }}>&#128176; Expenses</Link>
          <Link to="/reports" className="btn btn-secondary"
                style={{ textDecoration: 'none' }}>&#128221; Reports</Link>
          <Link to="/preferences" className="btn btn-secondary"
                style={{ textDecoration: 'none' }}>&#9881;&#65039; Preferences</Link>
          <Button className="btn btn-secondary">Hello</Button>
        </div>
        <Switch>
          <Route path="/expenses">
            <Expenses/>
          </Route>
          <Route path="/reports">
            <Reports/>
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
