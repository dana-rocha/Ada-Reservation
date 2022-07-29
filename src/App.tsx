import React from 'react';
import { useState, useEffect } from 'react';
import { roomsCollection, timeSlotCollection } from "./firebase-config";
import { getDocs } from "@firebase/firestore";
import adaLogo from "./images/logo.png"
import './App.css';

function App() {
 // Setting the type for RoomData
  interface RoomData {
    id: string;
    name: string;
  }

  // // Setting the type for TimeSlotData to string
  interface TimeSlotData {
    stateid: string;
    id: number;
  }

  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);

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
    const timeData = await getDocs(timeSlotCollection);
    setTimeSlots(timeData.docs.map((timeDoc) => (
      { ...timeDoc.data(), stateid: timeDoc.id }
    )));
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
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

export default App;
