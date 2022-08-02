import React from "react";
import adaLogo from "./images/logo.png";
import NewReservation from "./components/ReservationForm";
import { doc, addDoc } from "@firebase/firestore";
import {
  reservationsCollection,
  roomsCollection,
  usersCollection,
} from "./firebase-config";
import "./App.css";

function App() {
  const makeReservation = async (NewSubmission) => {
    // Add a new document in collection "reservations"
    await addDoc(
      reservationsCollection,
      NewSubmission
      //   {
      //   // NewSubmission
      //   date: NewSubmission.date,
      //   description: NewSubmission.description,
      //   reservedBy: NewSubmission.reservedBy,
      //   room: doc(roomsCollection / NewSubmission.room),
      //   timeslot: NewSubmission.timeslot,
      //   // room: string(id) => firestore.roomcollection/string(id),
      //   // timeslot: string(stateid) => firestore.timeslotcollection/string(stateid)
      // }
    );
    console.log(NewSubmission);
  };
  return (
    <div className="App">
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo" />
      </header>
      <main>
        <div className="reservation-form">
          <NewReservation handleSubmission={makeReservation} />
        </div>
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

export default App;
