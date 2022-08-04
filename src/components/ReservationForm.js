import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { roomsCollection, timeSlotCollection } from "../firebase-config";
import { getDocs, orderBy, query } from "@firebase/firestore";
import "./ReservationForm.css";

const defaultForm = {
  date: "",
  description: "",
  room: "",
  timeslot: "",
  reservedBy: "",
};

const NewReservation = (props) => {
  const [formData, setFormData] = useState(defaultForm);
  const [startDate, setStartDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

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

  // Submit form & reset back to default
  const createReservation = (event) => {
    event.preventDefault();
    props.handleSubmission(formData);
    alert(`Success! You have reserved ${formData.room}!`);
    setFormData(defaultForm);
  };

  const onInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={createReservation}>
      <section id="reservationForm">
        <div className="row">
          <div className="column">
            <h2> Make a Reservation </h2>
            <label htmlFor="date" className="calendar">
              New Reservation Date:
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setFormData({ ...formData, date: date });
                }}
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
