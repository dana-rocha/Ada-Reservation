import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { addDoc } from "@firebase/firestore";
import { reservationsCollection } from "./firebase-config";
import NewReservation from "./components/ReservationForm";
import LoginComponent from "./components/Login";
import UserDash from "./components/UserDash";
import M from  'materialize-css/dist/js/materialize.min.js';
import "./App.css";
import AdaPic from "./images/web_pic.jpg";
import adaLogo from "./images/logo.png";

function App() {
  return (
    <div className="App">
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo" />
        <nav id="navbar">
          <div className='container'>
            <ul id='nav-mobile' class='right hide-on-med-and-down'>
              <Link to="/home" className="links">
                Home
              </Link>
              <Link to="/user" className="links">
                User
              </Link>
            </ul>
          </div>
        
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Login />} component={Login} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </main>
      <footer>© 2022 Ada C17 alumni - Dana Rocha 🐳 & Elaine Smith 🦦 </footer>
    </div>
  );
}

function Login() {
  return (
    <>
      <p>🦁 C18 - You got this! 🐆 </p>
      <img src={AdaPic} alt="Changing the face of tech." id="ada-pic" />
      <LoginComponent />
    </>
  );
}

function Home() {
  const makeReservation = async (NewSubmission) => {
    // Add a new document in collection "reservations"
    const docRef = await addDoc(reservationsCollection, NewSubmission);
  };
  return (
    <div className="reservation-form">
      <NewReservation handleSubmission={makeReservation} />
    </div>
  );
}

function User() {
  return (
    <>
      <UserDash />
    </>
  );
}

export default App;
