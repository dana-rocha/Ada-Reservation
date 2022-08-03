import React from "react";
import { useState, useEffect } from "react";
import CalendarPicker from "./Calendar";
import { roomsCollection, timeSlotCollection } from "../firebase-config";
import { getDocs, orderBy, query } from "@firebase/firestore";

const defaultForm = {
  date: "",
  description: "",
  room: "",
  timeslot: "",
  reservedBy: "",
};

const NewReservation = (props) => {
  const [formData, setFormData] = useState(defaultForm);
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
    setFormData(defaultForm);
    alert("Success!!");
  };

  const onInputChange = (event) => {
    console.log("Inside onInputChange");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={createReservation}>
      <section>
        <h2> Make a Reservation </h2>
        <div className="reservation_fields">
          <label htmlFor="date">
            New Reservation Date:
            <CalendarPicker
              name="date"
              value={props.selected}
              onOutsideClick={onInputChange}
            />
          </label>
          <br />
          <label htmlFor="reservedBy">
            Reserved By:
            <input
              type="text"
              name="reservedBy"
              value={formData.reservedBy}
              onChange={onInputChange}
            />
          </label>
          <br />
          <label htmlFor="description">
            New Reservation Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={onInputChange}
            />
          </label>
          <br />
          <label htmlFor="timeslot">
            New Reservation Timeslot:
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
          <label htmlFor="room">
            Reservation room:
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
      </section>
    </form>
  );
};

export default NewReservation;
