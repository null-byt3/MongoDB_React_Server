import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    async function callAPI() {
      const res = await fetch("http://localhost:9000/testAPI");
      const parsed = await res.text();
      console.log(parsed);
      setApiResponse(parsed);
    }
    callAPI();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {apiResponse}
    </div>
  );
}

export default App;
