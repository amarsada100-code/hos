
import { lazy, Suspense, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import DoctorList from "./components/DoctorList";
import Loading from "./components/Loading";

const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Appointments = lazy(() => import("./components/Appointments"));

const doctors = [
  {
    id: 101,
    name: "Dr. Arun Kumar",
    specialty: "Cardiology",
    qualification: "MBBS, MD",
    experience: "10 years",
    fee: 500,
    rating: 4.8,
  },
  {
    id: 102,
    name: "Dr. Priya Sharma",
    specialty: "Dermatology",
    qualification: "MBBS, MD",
    experience: "8 years",
    fee: 400,
    rating: 4.7,
  },
  {
    id: 103,
    name: "Dr. Rahul Verma",
    specialty: "Neurology",
    qualification: "MBBS, DM",
    experience: "12 years",
    fee: 600,
    rating: 4.9,
  },
  {
    id: 104,
    name: "Dr. Meena Raj",
    specialty: "Cardiology",
    qualification: "MBBS, MD",
    experience: "6 years",
    fee: 450,
    rating: 4.6,
  },
];

function readAppointments() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Header() {
  const isAuthenticated = useSelector(
    (state) => state.auth?.isAuthenticated
  );

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        MediCare+
      </Link>

      <nav aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/doctors">Find Doctors</Link>
        <Link to="/appointments">Appointments</Link>
        {isAuthenticated ? (
          <Link to="/patient">Patient Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

function Home() {
  return (
    <main className="container">
      <section className="hero">
        <span className="tag">YOUR HEALTH, OUR PRIORITY</span>
        <h1>Welcome to MediCare+</h1>
        <p>
          Find doctors, explore specialties, and book your
          appointments in one convenient place.
        </p>
        <Link to="/doctors" className="btn">
          Find Your Doctor →
        </Link>
      </section>

      <section>
        <h2>Why choose MediCare+?</h2>
        <div className="doctor-grid">
          <article className="doctor-card">
            <h3>Experienced Doctors</h3>
            <p>Explore doctors across different specialties.</p>
          </article>

          <article className="doctor-card">
            <h3>Easy Booking</h3>
            <p>Choose a doctor and request an appointment.</p>
          </article>

          <article className="doctor-card">
            <h3>Simple Management</h3>
            <p>Review your saved appointment information.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function DoctorDetailsPage() {
  const { id } = useParams();
  const doctor = doctors.find((item) => item.id === Number(id));

  if (!doctor) {
    return (
      <main className="container">
        <h1>Doctor not found</h1>
        <Link to="/doctors" className="btn">
          Back to Doctors
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <article className="doctor-card details-card">
        <h1>{doctor.name}</h1>
        <p>Specialty: {doctor.specialty}</p>
        <p>Qualification: {doctor.qualification}</p>
        <p>Experience: {doctor.experience}</p>
        <p>Rating: {doctor.rating} / 5</p>
        <p>Consultation Fee: ₹{doctor.fee}</p>

        <Link
          to={`/appointments?doctorId=${doctor.id}`}
          className="btn"
        >
          View Appointments
        </Link>

        <p>
          <Link to="/doctors">← Back to Doctors</Link>
        </p>
      </article>
    </main>
  );
}

function PatientProfile() {
  const appointments = readAppointments();

  return (
    <main className="container">
      <h1>Patient Profile</h1>
      <p>Welcome to your MediCare+ profile.</p>
      <h2>Saved Appointments</h2>

      {appointments.length === 0 ? (
        <p>No saved appointments found.</p>
      ) : (
        <ul>
          {appointments.map((appointment, index) => (
            <li key={appointment.id ?? index}>
              {appointment.doctorName ||
                appointment.doctor ||
                "Doctor"}
              {" — "}
              {appointment.date || "Date not specified"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function NotFound() {
  return (
    <main className="container">
      <h1>404 - Page Not Found</h1>
      <Link to="/" className="btn">
        Go Home
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/doctors"
            element={
              <main className="container">
                <DoctorList />
              </main>
            }
          />

          <Route
            path="/doctor/:id"
            element={<DoctorDetailsPage />}
          />

          <Route
            path="/appointments"
            element={<Appointments />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/patient"
            element={<PatientProfile />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <footer className="container">
        <p>© {new Date().getFullYear()} MediCare+. All rights reserved.</p>
      </footer>
    </>
  );
}

