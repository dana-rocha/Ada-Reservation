import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "@firebase/firestore";

// Init the firebase app
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
};

// Export firestore db for access in other files
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const createCollection = (collectionName) => {
  return collection(db, collectionName);
};

// Export all collections
export const roomsCollection = createCollection("rooms");
export const usersCollection = createCollection("users");
export const timeSlotCollection = createCollection("timeslots");
export const reservationsCollection = createCollection("reservations");
