import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import getDay from "date-fns/getDay";
import {
  roomsCollection,
  timeSlotCollection,
  reservationsCollection,
  auth
} from "../firebase-config";
import { getDocs, orderBy, query, where } from "@firebase/firestore";
import "./ReservationForm.css";
import "./Calendar.css";
import ReservationList from "./ReservationList";

// const useAuthenticationHome = () => {
//   const [user, loading] = useAuthState(auth);
//   const navigate = useNavigate();

//     // User can't access home and user page without login
//     useEffect(() => {
//       if (loading) return;
//       if (!user) return navigate("/");
//     }, [user, loading]);
// }

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

  // User can't access home and user page without login
  useEffect(() => {
    // console.log(user)
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
      const resData = await getDocs(
        query(reservationsCollection, orderBy("date", "asc"))
      );
      setReservations(
        resData.docs.map((resDoc) => ({ ...resDoc.data(), id: resDoc.id }))
      );
    };
    getReservations();

    // setFormData({ ...formData, reservedBy: user.uid});
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

      // Double booking logic: can't book same room, date, and timeslot
      if (
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

    // console.log(user.uid)

    isValid().then((result) => {
      savedResult = result.every(Boolean);

      // Validate reservation 
      if (savedResult === false) {
        alert("Sorry, cannot reserve room.");
        return console.log("ERROR: Cannot double-book reservations");
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
    console.log(user.uid)
    setFormData({ ...formData, [event.target.name]: event.target.value });
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
          {/* <label htmlFor="reservedBy" className="form-right">
              Reserved By:
              <input
                type="hidden"
                name="reservedBy"
                defaultValue={user.uid}
                // onChange={onInputChange}
              />
            </label>
            <br /> */}
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
          <div className="column" id="reservation-list">
            <h3>Current Reservations</h3>
            <ReservationList reservationData={reservations} />
          </div>
        </div>
      </section>
    </form>
  );
};

export default NewReservation;
