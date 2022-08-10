import "./Reservation.css";

const Reservation = (props) => {
  // Convert Firebase date to Human date
  const convertedDate = new Date(props.date.seconds * 1000);
  const day = convertedDate.getDate();
  const month = convertedDate.getMonth() + 1;
  const year = convertedDate.getFullYear();
  const date = `${month}/${day}/${year}`;

  // Define other props
  const room = props.room.replace(/([A-Z])/g, " $1").trim(); // Display room name w/ spaces
  const timeslot = props.timeslot;
  const reserved = props.reservedBy;
  const description = props.description;

  return (
    <div id="reservation">
      <p>{date}</p>
      <p>{room}</p>
      <p>{timeslot}</p>
      <p>{reserved}</p>
      <p>{description}</p>
    </div>
  );
};

export default Reservation;
