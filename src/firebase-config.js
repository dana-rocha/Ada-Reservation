import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, addDoc, getDocs } from "@firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, 
  signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, 
  signOut} from "firebase/auth";

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


// Initialize Firebase Authentication
const auth = getAuth(firebaseApp);

// Registering a new user with email and password
const registerWithEmailAndPassword = async(name, userEmail, userPassword) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
    const newUser = response.user;

    await addDoc(usersCollection, {
      uid: newUser.uid,
      name,
      authProvider: "local",
      userEmail,
    });
  } catch (error) {
    console.error(error);
    alert("Cannot create a new user.");
  }
};

// Google Authentication
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    const user = response.user;

    // Querying the db to check if this user is registered with user uid (uid is a firebase thing)
    const validUser = query(usersCollection, where("uid", "==", user.uid));

    const googleUserDocs = await getDocs(validUser);

    // If there is no user with the uid, make a new record in the db
    if (googleUserDocs.docs.length === 0) {
      await addDoc(usersCollection, {
        uid: user.uid,
        name: user.displayName, 
        authProvider: "google",
        email: user.email,
      });
    }
    
  } catch (error) {
    console.error(error);
    alert("Cannot find this user.");
  }
};

// Signing in with using an email and password
const logInWithEmailAndPassword = async (userEmail, userPassword) => {
  try {
    await signInWithEmailAndPassword(auth, userEmail, userPassword);
  } catch (error) {
    console.error(error);
    alert("Cannot log in.")
  }
};

// Send a password reset link to user's email
const sendPasswordResetLink = async (userEmail) => {
  try {
    await sendPasswordResetEmail(auth, userEmail);
    alert("Password reset link sent.")
  } catch (errorMsg) {
    console.error(errorMsg);
    alert("Reset link cannot be sent to this email.")
  }
}

// Logout function
const logout = () => {
  signOut(auth);
};

export {
  auth, signInWithGoogle, signInWithEmailAndPassword, logout,
  logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordResetLink,
};