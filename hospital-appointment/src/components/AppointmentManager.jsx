import { useState } from "react";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation
} from "../app/hospitalApi";
import Loading from "./Loading";

export default function AppointmentManager() {
  const {
    data: appointments = [],
    isLoading,
    isError,
    refetch
  } = useGetAppointmentsQuery();

  const [
    updateAppointment,
    { isLoading: updating }
  ] = useUpdateAppointmentMutation();

  const [
    deleteAppointment,
    { isLoading: deleting }
  ] = useDeleteAppointmentMutation();

  const [changes, setChanges] = useState({});
  const [message, setMessage] = useState("");

  function updateChange(id, field, value) {
    setChanges((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value
      }
    }));
  }

  async function handleReschedule(appointment) {
    const change = changes[appointment.id] || {};
    const date = change.date || appointment.date;
    const timeSlot = change.timeSlot || appointment.timeSlot;

    if (
      date === appointment.date &&
      timeSlot === appointment.timeSlot
    ) {
      setMessage("Choose a new date or time first.");
      return;
    }

    try {
      setMessage("");

      await updateAppointment({
        id: appointment.id,
        date,
        timeSlot,
        status: "Rescheduled"
      }).unwrap();

      setMessage("Appointment rescheduled successfully!");

      setChanges((previous) => ({
        ...previous,
        [appointment.id]: {}
      }));
    } catch (error) {
      setMessage("Unable to reschedule appointment.");
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setMessage("");

      await deleteAppointment(id).unwrap();

      setMessage("Appointment deleted successfully.");
    } catch (error) {
      setMessage("Unable to cancel appointment.");
    }
  }

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <section className="container">
        <p className="error">Unable to retrieve appointments.</p>
        <button className="btn" onClick={refetch}>
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="container">
      <h1>My Appointments</h1>

      {message && <p className="success">{message}</p>}

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="doctor-grid">
          {appointments.map((appointment) => {
            const change = changes[appointment.id] || {};

            return (
              <div className="doctor-card" key={appointment.id}>
                <h3>{appointment.doctorName}</h3>
                <p>Specialty: {appointment.specialty}</p>
                <p>
                  Patient: {appointment.patientDetails?.name}
                </p>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.timeSlot}</p>
                <p>Status: {appointment.status}</p>

                <label>New Date</label>
                <input
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={change.date ?? appointment.date}
                  onChange={(e) =>
                    updateChange(
                      appointment.id,
                      "date",
                      e.target.value
                    )
                  }
                />

                <label>New Time Slot</label>
                <input
                  value={change.timeSlot ?? appointment.timeSlot}
                  onChange={(e) =>
                    updateChange(
                      appointment.id,
                      "timeSlot",
                      e.target.value
                    )
                  }
                  placeholder="e.g. 10:00 AM"
                />

                <button
                  className="btn"
                  disabled={updating || deleting}
                  onClick={() => handleReschedule(appointment)}
                >
                  {updating ? "Updating..." : "Reschedule"}
                </button>

                <button
                  className="btn cancel-btn"
                  disabled={updating || deleting}
                  onClick={() => handleCancel(appointment.id)}
                >
                  {deleting ? "Cancelling..." : "Cancel Appointment"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}