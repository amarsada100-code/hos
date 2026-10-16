import React from "react";

export default function DoctorDetails({ doctor, onBook }) {
  if (!doctor) {
    return <p role="alert">Doctor details not available.</p>;
  }

  return (
    <section aria-label="Doctor details">
      <h1>{doctor.name}</h1>
      <p>Specialty: {doctor.specialty}</p>
      <p>Qualification: {doctor.qualification || "MBBS"}</p>
      <p>Experience: {doctor.experience || 0} years</p>
      <p>Consultation Fee: ₹{doctor.fee ?? 0}</p>

      <button type="button" onClick={() => onBook?.(doctor)}>
        Book Appointment
      </button>
    </section>
  );
}