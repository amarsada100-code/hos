
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const DB_FILE = path.join(__dirname, "..", "db.json");
const JWT_SECRET =
  process.env.JWT_SECRET || "demo-secret-change-before-deployment";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const demoPatient = {
  id: "1",
  name: "Demo Patient",
  email: "patient@example.com",
  passwordHash: bcrypt.hashSync("Patient@123", 10),
};

// REGISTER NEW PATIENT
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Please provide your name, email and password.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const db = readDB();
    db.patients ||= [];

    const normalizedEmail = email.trim().toLowerCase();

    const exists =
      normalizedEmail === demoPatient.email ||
      db.patients.some(
        (patient) =>
          patient.email.toLowerCase() === normalizedEmail
      );

    if (exists) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const patient = {
      id: String(Date.now()),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    };

    db.patients.push(patient);
    writeDB(db);

    return res.status(201).json({
      message: "Account created successfully.",
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Unable to create account. Please try again.",
    });
  }
});

// LOGIN EXISTING PATIENT
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = readDB();

    let patient = null;

    if (normalizedEmail === demoPatient.email) {
      if (
        await bcrypt.compare(password, demoPatient.passwordHash)
      ) {
        patient = demoPatient;
      }
    } else {
      const savedPatient = (db.patients || []).find(
        (item) =>
          item.email.toLowerCase() === normalizedEmail
      );

      if (
        savedPatient &&
        savedPatient.passwordHash &&
        await bcrypt.compare(password, savedPatient.passwordHash)
      ) {
        patient = savedPatient;
      }
    }

    if (!patient) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        sub: String(patient.id),
        email: patient.email,
        role: "patient",
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      token,
      expiresIn: 900,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

// VERIFY JWT TOKEN
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        message: "Token expired or invalid. Please log in again.",
      });
    }

    if (user.role !== "patient") {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    req.user = user;
    next();
  });
}

// PUBLIC DOCTOR APIs
app.get("/doctors", (req, res) => {
  res.json(readDB().doctors || []);
});

app.get("/doctors/:id", (req, res) => {
  const doctor = (readDB().doctors || []).find(
    (item) => String(item.id) === req.params.id
  );

  if (!doctor) {
    return res.status(404).json({
      message: "Doctor not found.",
    });
  }

  res.json(doctor);
});

app.get("/availability", (req, res) => {
  const db = readDB();

  const slots = (db.availability || []).filter(
    (item) =>
      String(item.doctorId) === String(req.query.doctorId)
  );

  res.json(slots);
});

// GET PATIENT'S APPOINTMENTS
app.get("/api/appointments", authenticateToken, (req, res) => {
  const db = readDB();

  const appointments = (db.appointments || []).filter(
    (item) => String(item.patientId) === req.user.sub
  );

  res.json(appointments);
});

// BOOK APPOINTMENT
app.post("/api/appointments", authenticateToken, (req, res) => {
  const { doctorId, date, timeSlot, patientDetails } = req.body;
  const db = readDB();

  const doctor = (db.doctors || []).find(
    (item) => String(item.id) === String(doctorId)
  );

  const availableDate = (db.availability || []).find(
    (item) =>
      String(item.doctorId) === String(doctorId) &&
      item.date === date
  );

  if (
    !doctor ||
    !availableDate ||
    !availableDate.slots?.includes(timeSlot)
  ) {
    return res.status(400).json({
      message: "Invalid doctor, date, or time slot.",
    });
  }

  if (
    !patientDetails?.name?.trim() ||
    !Number.isFinite(Number(patientDetails.age)) ||
    Number(patientDetails.age) < 1 ||
    !/^\d{10}$/.test(patientDetails.phone || "")
  ) {
    return res.status(400).json({
      message: "Valid patient name, age and 10-digit phone are required.",
    });
  }

  db.appointments ||= [];

  const conflict = db.appointments.some(
    (item) =>
      String(item.doctorId) === String(doctor.id) &&
      item.date === date &&
      item.timeSlot === timeSlot &&
      item.status !== "Cancelled"
  );

  if (conflict) {
    return res.status(409).json({
      message: "This time slot has already been booked.",
    });
  }

  const appointment = {
    id: String(Date.now()),
    patientId: req.user.sub,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    timeSlot,
    patientDetails,
    status: "Booked",
    createdAt: new Date().toISOString(),
  };

  db.appointments.push(appointment);
  writeDB(db);

  res.status(201).json(appointment);
});
// UPDATE / RESCHEDULE APPOINTMENT
app.patch("/api/appointments/:id", authenticateToken, (req, res) => {
  const db = readDB();

  const appointment = (db.appointments || []).find(
    item =>
      String(item.id) === req.params.id &&
      String(item.patientId) === req.user.sub
  );

  if (!appointment) {
    return res.status(404).json({
      message: "Appointment not found."
    });
  }

  const date = req.body.date ?? appointment.date;
  const timeSlot = req.body.timeSlot ?? appointment.timeSlot;

  const availableDate = (db.availability || []).find(
    item =>
      String(item.doctorId) === String(appointment.doctorId) &&
      item.date === date
  );

  if (
    !availableDate ||
    !availableDate.slots?.includes(timeSlot)
  ) {
    return res.status(400).json({
      message: "Invalid date or time slot."
    });
  }

  const conflict = (db.appointments || []).some(
    item =>
      String(item.id) !== String(appointment.id) &&
      String(item.doctorId) === String(appointment.doctorId) &&
      item.date === date &&
      item.timeSlot === timeSlot &&
      item.status !== "Cancelled"
  );

  if (conflict) {
    return res.status(409).json({
      message: "This time slot has already been booked."
    });
  }

  appointment.date = date;
  appointment.timeSlot = timeSlot;
  appointment.status = "Rescheduled";

  writeDB(db);

  res.json({
    message: "Appointment updated successfully.",
    appointment
  });
});

// CANCEL APPOINTMENT
app.delete("/api/appointments/:id", authenticateToken, (req, res) => {
  const db = readDB();

  const index = (db.appointments || []).findIndex(
    (item) =>
      String(item.id) === req.params.id &&
      String(item.patientId) === req.user.sub
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Appointment not found.",
    });
  }

  db.appointments.splice(index, 1);
  writeDB(db);

  res.status(204).end();
});

app.listen(5000, () => {
  console.log("Hospital API running at http://localhost:5000");
});
