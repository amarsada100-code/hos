import { useGetAppointmentsQuery } from "../app/hospitalApi";
import Loading from "./Loading";

export default function AppointmentHistory() {
  const {
    data: appointments = [],
    isLoading,
    isError,
    refetch
  } = useGetAppointmentsQuery();

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <section className="container">
        <p className="error">Unable to load appointment history.</p>
        <button className="btn" onClick={refetch}>
          Try Again
        </button>
      </section>
    );
  }

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <section className="container">
      <h1>Appointment History</h1>
      <p>Previously saved appointments.</p>

      {sortedAppointments.length === 0 ? (
        <p>No appointment history available.</p>
      ) : (
        <div className="doctor-grid">
          {sortedAppointments.map((appointment) => (
            <div className="doctor-card" key={appointment.id}>
              <h3>{appointment.doctorName}</h3>
              <p>Specialty: {appointment.specialty}</p>
              <p>Patient: {appointment.patientDetails?.name}</p>
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.timeSlot}</p>
              <p>Status: {appointment.status}</p>
              <p>
                Created:{" "}
                {appointment.createdAt
                  ? new Date(appointment.createdAt).toLocaleString()
                  : "Not recorded"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}