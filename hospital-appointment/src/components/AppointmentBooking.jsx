import { useState } from "react";
import { useGetAvailabilityQuery, useCreateAppointmentMutation } from "../app/hospitalApi";
import Loading from "./Loading";

export default function AppointmentBooking({ doctor }) {
  const {
    data: availability = [],
    isLoading,
    isError,
    refetch
  } = useGetAvailabilityQuery(doctor.id);

  const [
    createAppointment,
    { isLoading: saving, error: saveError }
  ] = useCreateAppointmentMutation();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [message, setMessage] = useState("");

  const selectedDate = availability.find(
    (item) => item.date === date
  );

  async function handleBooking(e) {
    e.preventDefault();
    setMessage("");

    if (!selectedDate || !selectedDate.slots.includes(slot)) {
      setMessage("Please select a valid date and time.");
      return;
    }

    try {
      await createAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        timeSlot: slot,
        patientDetails: {
          name: patientName,
          age: Number(patientAge),
          phone: patientPhone
        },
        status: "Booked",
        createdAt: new Date().toISOString()
      }).unwrap();

      setMessage("Appointment saved successfully!");
      setDate("");
      setSlot("");
      setPatientName("");
      setPatientAge("");
      setPatientPhone("");
    } catch (err) {
      setMessage("Booking failed. Please try again.");
    }
  }

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="booking-card">
        <p className="error">Unable to load available slots.</p>
        <button className="btn" onClick={refetch}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="booking-card">
      <h2>Book an Appointment</h2>

      {availability.length === 0 ? (
        <p>No available dates found.</p>
      ) : (
        <form onSubmit={handleBooking}>
          <label>Patient Name</label>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
            placeholder="Enter patient name"
          />

          <label>Patient Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            required
            placeholder="Enter age"
          />

          <label>Phone Number</label>
          <input
            type="tel"
            pattern="[0-9]{10}"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            required
            placeholder="10-digit phone number"
          />

          <label>Appointment Date</label>
          <select
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlot("");
              setMessage("");
            }}
            required
          >
            <option value="">Choose date</option>
            {availability.map((item) => (
              <option key={item.id} value={item.date}>
                {item.date}
              </option>
            ))}
          </select>

          <label>Time Slot</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            disabled={!date}
            required
          >
            <option value="">Choose time</option>
            {selectedDate?.slots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      )}

      {message && <p className="success">{message}</p>}

      {saveError && (
        <p className="error">Server error while saving appointment.</p>
      )}
    </div>
  );
}