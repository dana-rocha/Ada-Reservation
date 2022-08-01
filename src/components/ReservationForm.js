import React from "react";
import { useState } from "react";

const defaultForm = {
    date: 'Aug 1, 2022',
    description: '1:1 meeting',
    room: 'Johnnie Jae',
    timeslot: '9:00AM-9:30AM',
    reservedBy: 'Dana'
}

const NewReservation = (props) => {
    const [formData, setFormData] = useState(defaultForm);

    // Resetting back to default form after submission
    const createReservation = (event) => {
        event.preventDefault();
        props.handleSubmission(formData);
        setFormData(defaultForm);
    };

    const onInputChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    return (
        <form onSubmit={createReservation}>
          <section>
            <h2> Make a Reservation </h2>
            <div className="reservation_fields">
              <label htmlFor="date">
                New Reservation Date:
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={onInputChange}
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
              <label htmlFor="room">
                Reservation room:
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={onInputChange}
                />
              </label>
              <label htmlFor="timeslot">
                New Reservation Timeslot:
                <input
                  type="text"
                  name="timeslot"
                  value={formData.timeslot}
                  onChange={onInputChange}
                />
              </label>
              <input type="submit" />
            </div>
        </section>
        </form>
    );
}

export default NewReservation;