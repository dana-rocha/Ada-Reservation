import React from "react";
import adaLogo from "./images/logo.png";
import NewReservation from "./components/ReservationForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo" />
      </header>
      <main>
        <div className="reservation-form">
          <NewReservation />
        </div>
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

export default App;
