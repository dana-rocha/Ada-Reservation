import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import getDay from "date-fns/getDay";
import {
  roomsCollection,
  timeSlotCollection,
  reservationsCollection,
  auth,
} from "../firebase-config";
import { getDocs, orderBy, query, where } from "@firebase/firestore";
import "./ReservationForm.css";
import "./Calendar.css";
import SideNav from "./SideNav";

const defaultForm = {
  date: new Date(),
  description: "",
  room: "",
  timeslot: "",
  reservedBy: "",
};

const NewReservation = (props) => {
  // useAuthenticationHome();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // form & collection state
  const [formData, setFormData] = useState(defaultForm);
  const [startDate, setStartDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    // User can't access home and user page without login
    if (loading) return;

    // If user isn't logged in, return to root
    if (!user) return navigate("/");

    // GET Room data
    const getRooms = async () => {
      const roomData = await getDocs(roomsCollection);
      setRooms(
        roomData.docs.map((roomDoc) => ({ ...roomDoc.data(), id: roomDoc.id }))
      );
    };
    getRooms();

    // Get TimeSlot Data
    const getTimeSlots = async () => {
      const sortedTimeData = await getDocs(
        query(timeSlotCollection, orderBy("id", "asc"))
      );
      setTimeSlots(
        sortedTimeData.docs.map((timeDoc) => ({
          ...timeDoc.data(),
          stateid: timeDoc.id,
        }))
      );
    };
    getTimeSlots();
  }, [user, loading]);

  // Setting dropdown options for Form => Rooms
  const roomComponents = rooms.map((room) => (
    <option key={room.id} value={room.id}>
      {room.name}
    </option>
  ));

  // Setting dropdown options for Form => Time Slots
  const timeSlotComponents = timeSlots.map((timeSlot) => (
    <option key={timeSlot.id} value={timeSlot.stateid}>
      {timeSlot.stateid}
    </option>
  ));

  const isValid = async () => {
    // Querying reservations by matching room
    const queryRes = await getDocs(
      query(reservationsCollection, where("room", "==", formData.room))
    );

    // Display each reservation
    const resMap = queryRes.docs.map((doc) => {
      // Date, month, year for reservationDoc
      let date = new Date(doc.data()["date"].seconds * 1000);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let reservationDate = `${month}/${day}/${year}`;

      // Date, month, year for formData
      let formDate = formData.date;
      let formDay = formDate.getDate();
      let formMonth = formDate.getMonth() + 1;
      let formYear = formDate.getFullYear();
      let submittedDate = `${formMonth}/${formDay}/${formYear}`;

      // Can't make reservation with blank forms
      if (formData.timeslot === "" || formData.room === "") {
        return false;
      } else if (
        // Double booking logic: can't book same room, date, and timeslot
        doc.data()["timeslot"] === formData.timeslot &&
        reservationDate === submittedDate
      ) {
        return false;
      } else {
        return true;
      }
    });

    return resMap;
  };

  // Submit form & reset back to default
  const createReservation = (event) => {
    event.preventDefault();
    let savedResult;

    isValid().then((result) => {
      // If result is an empty array
      if (result.length === 0) {
        savedResult = false;
      } else {
        savedResult = result.every(Boolean);
      }

      // Validate reservation
      if (savedResult === false) {
        // Can't double book, Can't have empty form fields
        alert("Sorry, cannot reserve room.");
        return console.log("ERROR");
      } else {
        props.handleSubmission(formData);
        // Alert message
        let formattedRoom = formData.room.replace(/([A-Z])/g, " $1").trim();
        alert(`Success! You have reserved ${formattedRoom}!`);
      }
    });
    setFormData(defaultForm);
  };

  const onInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
      reservedBy: user.uid,
    });
  };

  // Can't book a reservation on weekends, Office is closed
  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  return (
    <form onSubmit={createReservation}>
      <div className="collection row">
        {/* Calendar Column */}
        <div className="left-column col s12 m6 l6">
          <div id="container calendar-column">
            <label htmlFor="date" className="calendar">
              <h4>Select a Date</h4>
              <div id="calendarContainer">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setFormData({ ...formData, date: date });
                  }}
                  minDate={new Date()}
                  filterDate={isWeekday}
                  inline
                />
              </div>
            </label>
          </div>
        </div>

        {/* Reservation Form Column */}
        <div className="right-column col s12 m6 l6">
          <div id="container reservation-form-container">
            <h4> Make a Reservation </h4>
            <p className="c18">🦁 C18 Lions & Cheetahs - We're rooting for you! 🐆 </p>
            <ul className="reservation-rules">
              <li>Reservation blocks are 30 mins long from 9AM - 5PM</li>
              <li>Max reservation is 1 hr</li>
              <li>
                If no one has room after you come your time, can extend
                reservation for 1 hour
              </li>
            </ul>
            <SideNav />
            <label htmlFor="timeslot" className="form-right">
              <select
                type="text"
                name="timeslot"
                value={formData.timeslot}
                onChange={onInputChange}
              >
                <option>Select a timeslot:</option>
                {timeSlotComponents}
              </select>
            </label>
            <label htmlFor="room" className="form-right">
              <select
                type="text"
                name="room"
                value={formData.room}
                onChange={onInputChange}
              >
                <option>Select a room:</option>
                {roomComponents}
              </select>
            </label>
            <br />
            <label htmlFor="description" className="form-right">
              <input
                type="text"
                name="description"
                placeholder="(Optional) Reservation Description"
                value={formData.description}
                onChange={onInputChange}
              />
            </label>
            <button
              className="btn waves-effect waves-light"
              type="submit"
              name="action"
            >
              Submit
              <i className="material-icons right">send</i>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewReservation;
