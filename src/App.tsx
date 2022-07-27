import React from 'react';
import { useState, useEffect } from 'react';
import { roomsCollection} from "./firebase-config";
import { getDocs } from "@firebase/firestore";
import './App.css';

function App() {
  // GET Room data
  interface RoomData {
    id: string;
    name: string;
  }

  const [rooms, setRooms] = useState<RoomData[]>([]);

  useEffect (() => {
    const getRooms = async () => {
    const data = await getDocs(roomsCollection);
    console.log(data.docs);
    setRooms(data.docs.map((doc) => (
      { ...doc.data(), id: doc.id }
    )));
  };
  getRooms();
  }, []);

  const roomComponents = rooms.map((room) => (
      <li key={room.id}>{room.name}</li>
    ));

  // GET User data
  
  return (
    <div className="App">
      <ul>{roomComponents}</ul>
    </div>
  );
}

export default App;
