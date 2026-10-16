import React from "react";

export default function DoctorCard({ doctor, onView }) {
  if (!doctor) return null;

  return (
    <article aria-label={`Doctor ${doctor.name}`}>
      <h2>{doctor.name}</h2>
      <p>{doctor.specialty}</p>
      <p>Qualification: {doctor.qualification || "MBBS"}</p>
      <p>Experience: {doctor.experience || 0} years</p>
      <p>Consultation Fee: ₹{doctor.fee ?? 0}</p>

      <button type="button" onClick={() => onView?.(doctor)}>
        View Details
      </button>
    </article>
  );
}