import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import adaLogo from "./images/logo.png";
import NewReservation from "./components/ReservationForm";
import { addDoc } from "@firebase/firestore";
import { reservationsCollection } from "./firebase-config";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo" />
        <nav id="navbar">
          <Link to="/" className="links">
            Login
          </Link>
          <Link to="/home" className="links">
            Home
          </Link>
          <Link to="/user" className="links">
            User
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

function Login() {
  return (
    <>
      <p>LOGIN PAGE</p>
    </>
  );
}

function Home() {
  const makeReservation = async (NewSubmission) => {
    // Add a new document in collection "reservations"
    const docRef = await addDoc(reservationsCollection, NewSubmission);
    console.log("New Reservation", docRef.id, NewSubmission);
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
      <p>USER INFO PAGE</p>
    </>
  );
}

export default App;
