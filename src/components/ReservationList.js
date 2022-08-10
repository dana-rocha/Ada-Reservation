import Reservation from "./Reservation";

const ReservationList = ({ reservationData }) => {
  const resComponents = reservationData.map((res) => (
    <Reservation
      key={res.id}
      date={res.date}
      room={res.room}
      timeslot={res.timeslot}
      reserved={res.reservedBy}
      description={res.description}
    />
  ));
  return <div>{resComponents}</div>;
};

export default ReservationList;
