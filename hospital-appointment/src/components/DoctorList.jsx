import React, { useMemo, useState } from "react";
import DoctorCard from "./DoctorCard";

export default function DoctorList({
  doctors = [],
  loading = false,
  error = "",
  onViewDoctor = () => {},
}) {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const specialties = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty).filter(Boolean))],
    [doctors]
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesSpecialty =
      specialty === "All" || doctor.specialty === specialty;

    return matchesSearch && matchesSpecialty;
  });

  if (loading) return <p role="status">Loading doctors...</p>;

  if (error) return <p role="alert">{error}</p>;

  return (
    <section>
      <h1>Find a Doctor</h1>

      <label htmlFor="doctor-search">Search doctor</label>
      <input
        id="doctor-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter doctor name"
      />

      <label htmlFor="specialty-filter">Specialty</label>
      <select
        id="specialty-filter"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      >
        <option value="All">All Specialties</option>
        {specialties.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {filteredDoctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div>
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onView={onViewDoctor}
            />
          ))}
        </div>
      )}
    </section>
  );
}