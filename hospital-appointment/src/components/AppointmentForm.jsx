import React, { useState } from "react";

export default function AppointmentForm({
  doctor,
  slots = ["10:00 AM", "11:00 AM", "02:00 PM"],
  onBook,
  loading = false,
  error = "",
}) {
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!doctor) {
      setMessage("Please select a doctor.");
      return;
    }

    if (!patientName.trim() || !date || !timeSlot) {
      setMessage("Please complete all fields.");
      return;
    }

    if (date < new Date().toLocaleDateString("en-CA")) {
      setMessage("Please select today or a future date.");
      return;
    }

    onBook?.({
      doctorId: doctor.id,
      doctorName: doctor.name,
      patientName: patientName.trim(),
      date,
      timeSlot,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book Appointment</h2>

      {error && <p role="alert">{error}</p>}
      {message && <p role="alert">{message}</p>}
      {loading && <p role="status">Booking appointment...</p>}

      <label htmlFor="patient-name">Patient Name</label>
      <input
        id="patient-name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />

      <label htmlFor="appointment-date">Appointment Date</label>
      <input
        id="appointment-date"
        type="date"
        min={new Date().toLocaleDateString("en-CA")}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label htmlFor="time-slot">Time Slot</label>
      <select
        id="time-slot"
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
      >
        <option value="">Select a time slot</option>
        {slots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <button type="submit" disabled={loading}>
        Confirm Booking
      </button>
    </form>
  );
}