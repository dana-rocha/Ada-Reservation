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
  // const reservationComponents = reservations.map((res) => {
  //   let myDate = res.date;
  //   return console.log(new Date(myDate.seconds * 1000), res.room, res.timeslot, res.reservedBy);
  // });

  const isValid = async () => {
    // Display each reservation
    console.log("inside isValid");

    // let valid = false;

    // compare formData w/ reservations
    const queryRes = await getDocs(query(reservationsCollection, where("room", "==", formData.room)));

    const resMap = queryRes.docs.map((doc) => {
      // date in data is returning seconds
      // console.log(doc.data()["timeslot"])
      // console.log(doc.data()["timeslot"] === formData.timeslot)
      let date = new Date(doc.data()["date"].seconds * 1000)
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      let reservationDate = `${day}/${month}/${year}`
      // console.log(str)

      let formDate = formData.date
      let formDay = formDate.getDate()
      let formMonth = formDate.getMonth() + 1
      let formYear = formDate.getFullYear()
      let submittedDate = `${formDay}/${formMonth}/${formYear}`
      // console.log(formStr)
      // console.log(new Date(doc.data()["date"].seconds * 1000).getFullYear())
      if (doc.data()["timeslot"] === formData.timeslot && reservationDate === submittedDate) {
        return false;
      } else {
        return true;
      }
      // return (console.log({
      //   id: doc.id,
      //   date: new Date(doc.data()["date"].seconds * 1000),
      //   room: doc.data()["room"],
      //   timeslot: doc.data()["timeslot"],
      // })
      // )
    })

    return resMap
    // return false;
    // if (doc.data()["timeslot"] === formData.timeslot) {
    //   return false;
    // } else {
    //   return true;
    // }

  };
  // const x = false;
  // Submit form & reset back to default
  const createReservation = (event) => {
    event.preventDefault();
    let savedResult;

    let validCheck = isValid()
      .then((result) => {
        savedResult = result.every(Boolean)
        // console.log(result)
        // console.log(savedResult)
        // Validate that reservation is valid
        if (savedResult === false) {
          // isValid();
          alert("Sorry, cannot reserve room.");
          return (console.log("inside create reservation function"));
        } else {
          props.handleSubmission(formData);
          alert(`Success! You have reserved ${formData.room.name}!`);
        }
      }
      )
    setFormData(defaultForm);
  };

  const onInputChange = (event) => {
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
