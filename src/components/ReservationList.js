import Reservation from "./Reservation";

const ReservationList = ({ reservationData, cancelResCallback }) => {
  const resComponents = reservationData.map((res) => (
    <Reservation
      key={res.id}
      id={res.id}
      date={res.date}
      room={res.room}
      timeslot={res.timeslot}
      reserved={res.reservedBy}
      description={res.description}
      cancelResCallback={cancelResCallback}
    />
  ));
  return <div>{resComponents}</div>;
};

export default ReservationList;
