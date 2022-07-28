import { initializeApp } from "firebase/app";
import { getFirestore, CollectionReference, collection, DocumentData } from "@firebase/firestore";
import { Room } from "./types/Room";
import { User } from "./types/User";

// Init the firebase app
const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PID,
    storageBucket: process.env.REACT_APP_SB,
    messagingSenderId: process.env.REACT_APP_SID,
    appId: process.env.REACT_APP_APPID
};

// Export firestore db for access in other files
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

// Collection(s) helper function for type declaration
const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

// Export all collections
export const roomsCollection = createCollection<Room>("rooms")
export const usersCollection = createCollection<User>("users")
