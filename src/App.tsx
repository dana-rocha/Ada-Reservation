import React, { useSyncExternalStore } from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import {db} from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [rooms, setRooms] = useState([]);
  const roomCollectionsRef = collection(db, "rooms")

  useEffect (() => {
    const getRooms = async () => {
    const data = await getDocs(roomCollectionsRef);
    console.log(data.docs);
    setRooms(data.docs.map((doc) => (
      { ...doc.data(), id: doc.id }
    )));
  };

  getRooms();
  }, []);

  return (
    <div className="App">
      {rooms.map((room) => {
        return (
          <div>
            {""}
            <h1>name: {room.name}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default App;
