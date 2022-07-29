import React from 'react';
import { useState, useEffect } from 'react';
import { roomsCollection, timeSlotCollection } from "./firebase-config";
import { getDocs, orderBy } from "@firebase/firestore";
import adaLogo from "./images/logo.png"
import './App.css';

function App() {
 // Setting the type for RoomData
  interface RoomData {
    id: string;
    name: string;
  }

  // Setting the type for TimeSlotData to string
  interface TimeSlotData {
    stateid: string;
    id: number;
  }

  interface sortedData {
    id: number;
  }

  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);

  useEffect (() => {
     // GET Room data
    const getRooms = async () => {
    const roomData = await getDocs(roomsCollection);
    // console.log(roomData.docs);
    setRooms(roomData.docs.map((roomDoc) => (
      { ...roomDoc.data(), id: roomDoc.id }
    )));
  };
  getRooms();

  // Get TimeSlot Data
//   .collection("timeslots")
// .orderBy("id", "asc")
  const getTimeSlots = async () => {
    // const timeslotcollection = getDocs(timeSlotCollection);
    const timeData = await getDocs(timeSlotCollection);
    const sortedTimeData = timeData.orderBy('id', 'asc');
    // console.log(timeData.docs);
    // const timeslotDocs = [];

    // timeData.docs.forEach((timeDoc) => (
      // const timeslot = timeDoc.data()
      // { ...doc.data(), id: doc.id }
      // for (timeslot of timeData) {
      //   timeslotDocs.push(timeslot)
      // }
    // ));

    const newTimeData = timeData.docs.map((timeDoc) => (
      { ...timeDoc.data(), stateid: timeDoc.id }
    ))

    // const sortedTimeData = newTimeData.orderBy<sortedData>('id', 'asc');

    setTimeSlots(sortedTimeData);
  };
  getTimeSlots();
  }, []);

  const roomComponents = rooms.map((room) => (
      <li key={room.id}>{room.name}</li>
    ));
  
  const timeSlotComponents = timeSlots.map((timeSlot) => (
    <li key={timeSlot.id}>{timeSlot.id}</li>
  ));

  // GET User data
  
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
