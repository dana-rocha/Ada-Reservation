import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarPicker = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        console.log("startDate", startDate);
        setStartDate(date);
        console.log("date", date);
      }}
      inline
    />
  );
};

export default CalendarPicker;
