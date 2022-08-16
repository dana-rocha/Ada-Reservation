import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase-config";
import {
  query,
  collection,
  getDocs,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { reservationsCollection } from "../firebase-config";
import ReservationList from "./ReservationList";
import "./UserDash.css";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();

    // GET User reservation data
    const getUserRes = async () => {
      const resData = await getDocs(
        query(reservationsCollection, where("reservedBy", "==", user.uid))
      );
      setReservations(
        resData.docs.map((resDoc) => ({ ...resDoc.data(), id: resDoc.id }))
      );
    };
    getUserRes();
  }, [user, loading]);

  const deleteRes = async (id) => {
    await deleteDoc(doc(reservationsCollection, id))
      .then((result) => {
        const cancelledRes = reservations.filter((res) => res.id !== id);
        setReservations(cancelledRes);
        alert("Success! You have deleted a reservation!");
      })
      .catch((error) => {
        console.log("ERROR");
      });
  };

  return (
    <div className="collection row dashboard-content">
      {/* Logout Column (Left) */}
      <div className="dashboard__column logout-column col s12 m6 l6">
        <div className="container dashboard__container">
          Logged in as:
          <div>{name}</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* User's Reservations Column (Right) */}
      <div className="dashboard__column col s12 m6 l6">
        <div className='container users-list'>
          <h4>My Reservations: </h4>
          <ReservationList
            reservationData={reservations}
            cancelResCallback={deleteRes}
            />
        </div>
      </div>

    </div>
  );
}
export default Dashboard;
