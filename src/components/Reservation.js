const Reservation = (props) => {
  // const date = new Date(props.date.seconds * 1000);
  // const date = props.date;
  const room = props.room;
  const timeslot = props.timeslot;
  const reserved = props.reservedBy;
  const description = props.description;
  return (
    <div>
      {/* <p>{date}</p> */}
      <p>{room}</p>
      <p>{timeslot}</p>
      <p>{reserved}</p>
      <p>{description}</p>
    </div>
  );
};

export default Reservation;
