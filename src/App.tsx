import React from 'react';
import { useState, useEffect } from 'react';
import { roomsCollection} from "./firebase-config";
import { getDocs } from "@firebase/firestore";
import adaLogo from "./images/logo.png"
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
      <header>
        <img src={adaLogo} alt="Ada Developers Academy logo" id="adaLogo"/>
      </header>
      <main>
        <ul>{roomComponents}</ul>
      </main>
      <footer>© 2022 Ada C17 alum grads - Dana Rocha & Elaine Smith</footer>
    </div>
  );
}

export default App;
