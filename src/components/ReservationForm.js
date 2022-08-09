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
import { getDocs, orderBy, query } from "@firebase/firestore";
import "./ReservationForm.css";
import "./Calendar.css";
// import "react-datepicker/dist/react-datepicker.css";

const defaultForm = {
  date: "",
  description: "",
  room: "",
  timeslot: "",
  reservedBy: "",
};

const NewReservation = (props) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // User can't access home and user page without login
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  const [formData, setFormData] = useState(defaultForm);
  const [startDate, setStartDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
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

    // GET Reservation data
    const getReservations = async () => {
      const resData = await getDocs(reservationsCollection);
      setReservations(
        resData.docs.map((resDoc) => ({ ...resDoc.data(), id: resDoc.id }))
      );
    };
    getReservations();
  }, []);

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

  // Reservation data
  const reservationComponents = reservations.map((res) => {
    let myDate = res.date;
    return console.log(new Date(myDate.seconds * 1000));
  });

  // Submit form & reset back to default
  const createReservation = (event) => {
    event.preventDefault();
    props.handleSubmission(formData);
    // Validate that reservation is valid
    if (!isValid) {
      alert("Sorry, cannot reserve room.");
    }
    alert(`Success! You have reserved ${formData.room}!`);
    setFormData(defaultForm);
  };

  const onInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const isValid = async () => {
    // Display each reservation
    console.log("inside isValid");
    // compare formData w/ reservations
    // if timeslot & room & date match => isValid = false
  };

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  return (
    <form onSubmit={createReservation}>
      <section id="reservationForm">
        <h2> Make a Reservation </h2>
        <ul>
          <li>Reservation blocks are 30 mins long from 9AM - 5PM</li>
          <li>Max reservation is 1 hr</li>
          <li>
            If no one has room after you come your time, can extend reservation
            for 1 hour
          </li>
        </ul>
        <div className="row">
          <div className="column">
            <label htmlFor="date" className="calendar">
              Select a Date:
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setFormData({ ...formData, date: date });
                }}
                filterDate={isWeekday}
                inline
              />
            </label>
          </div>
          <div className="column">
            <label htmlFor="reservedBy" className="form-right">
              Reserved By:
              <input
                type="text"
                name="reservedBy"
                value={formData.reservedBy}
                onChange={onInputChange}
              />
            </label>
            <br />
            <label htmlFor="description" className="form-right">
              Description:
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={onInputChange}
              />
            </label>
            <br />
            <label htmlFor="timeslot" className="form-right">
              Timeslot:
              <select
                type="text"
                name="timeslot"
                value={formData.timeslot}
                onChange={onInputChange}
              >
                <option>Select a time slot:</option>
                {timeSlotComponents}
              </select>
            </label>
            <br />
            <label htmlFor="room" className="form-right">
              Room:
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
            <input type="submit" />
          </div>
        </div>
      </section>
    </form>
  );
};

export default NewReservation;
