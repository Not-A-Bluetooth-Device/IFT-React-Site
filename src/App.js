import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Login } from "./Pages/Login/Login";
import { Register } from "./Pages/Login/Register";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
      }
    </div>
  );
}

export default App;
