import React from "react";
import adaLogo from "./images/logo.png";
import NewReservation from "./components/ReservationForm";
import { addDoc } from "@firebase/firestore";
import { reservationsCollection } from "./firebase-config";
import "./App.css";

function App() {
  let msg = "";
  const makeReservation = async (NewSubmission) => {
    // Add a new document in collection "reservations"
    await addDoc(
      reservationsCollection,
      NewSubmission
    );
    console.log(NewSubmission);
    msg = `Success! You have reserved ${NewSubmission.room}!`;
  };
  return (
    <div className="App">
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo" />
      </header>
      <main>
        <div>{msg}</div>
        <div className="reservation-form">
          <NewReservation handleSubmission={makeReservation} />
        </div>
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

export default App;
