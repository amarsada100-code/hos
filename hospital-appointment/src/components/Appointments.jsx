import React from "react";

export default function Appointments({
  appointments = [],
  onCancel,
  loading = false,
  error = "",
}) {
  if (loading) return <p role="status">Loading appointments...</p>;

  if (error) return <p role="alert">{error}</p>;

  return (
    <section>
      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <article key={appointment.id}>
            <h2>{appointment.doctorName}</h2>
            <p>Patient: {appointment.patientName}</p>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.timeSlot}</p>
            <p>Status: {appointment.status || "Booked"}</p>

            <button
              type="button"
              onClick={() => onCancel?.(appointment.id)}
            >
              Cancel Appointment
            </button>
          </article>
        ))
      )}
    </section>
  );
}