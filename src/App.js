import React from 'react';
import { useState, useEffect } from 'react';
import { roomsCollection, timeSlotCollection} from "./firebase-config";
import { getDocs, orderBy, query } from "@firebase/firestore";
import adaLogo from "./images/logo.png"
import './App.css';
import NewReservation from './components/ReservationForm';

function App() {



  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect (() => {
    // GET Room data
    const getRooms = async () => {
    const roomData = await getDocs(roomsCollection);
    setRooms(roomData.docs.map((roomDoc) => (
      { ...roomDoc.data(), id: roomDoc.id }
    )));
  };
  getRooms();

  // Get TimeSlot Data
    const getTimeSlots = async () => {
    // const timeData = await getDocs(timeSlotCollection).orderBy('id', 'asc');
    // const timeData = query(timeSlotCollection, orderBy('id', 'asc'));
    const sortedTimeData = await getDocs(query(timeSlotCollection,orderBy('id', 'asc')));
    console.log(sortedTimeData);
    // const sortedTime = query(timeSlotRef).orderBy("id", "asc");

    setTimeSlots(sortedTimeData.docs.map((timeDoc) => (
      { ...timeDoc.data(), stateid: timeDoc.id }
    )));
    // setTimeSlots(sortedTimeData);
    };
    getTimeSlots();
  }, []);


  const roomComponents = rooms.map((room) => (
      <li key={room.id}>{room.name}</li>
    ));
  
  const timeSlotComponents = timeSlots.map((timeSlot) => (
    <li key={timeSlot.id}>{timeSlot.stateid}</li>
  ));
  
  return (
    <div className="App">
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo"/>
      </header>
      <main>
        <ul>{roomComponents}</ul>
        <ul>{timeSlotComponents}</ul>
        <div>
          <NewReservation/>
        </div>
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

export default App;
