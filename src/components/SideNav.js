import React, { useState, useEffect } from "react";
import ReservationList from "./ReservationList";
import { reservationsCollection } from "../firebase-config";
import { getDocs, orderBy, query, where } from "@firebase/firestore";
import "./ReservationForm.css";
import M from "materialize-css/dist/js/materialize.min.js";
import './SideNav.css';


const SideNav = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    let sidenav = document.querySelector("#slide-out");
    M.Sidenav.init(sidenav, {});

    const getReservations = async () => {
      const resData = await getDocs(
        query(
          reservationsCollection,
          where("date", ">=", new Date()),
          orderBy("date")
        )
      );
      setReservations(
        resData.docs.map((resDoc) => ({ ...resDoc.data(), id: resDoc.id }))
      );
    };
    getReservations();
  }, []);

  return (
    <>
      <ul id="slide-out" className="sidenav">
        <li>
          <div id="reservation-list">
            <h4>Current Reservations</h4>
            <ReservationList reservationData={reservations} />
          </div>
        </li>
      </ul>
      <a href="#" data-target="slide-out" className="sidenav-trigger">
        <i className="material-icons">menu</i> Current Reservations
      </a>
    </>
  );
};

export default SideNav;
