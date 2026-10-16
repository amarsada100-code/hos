import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DoctorCard from "../DoctorCard";
import DoctorList from "../DoctorList";
import DoctorDetails from "../DoctorDetails";
import AppointmentForm from "../AppointmentForm";
import Appointments from "../Appointments";

const doctor = {
  id: 101,
  name: "Dr. Arun",
  specialty: "Cardiology",
  qualification: "MBBS, MD",
  experience: 8,
  fee: 500,
};

const doctors = [
  doctor,
  {
    id: 102,
    name: "Dr. Priya",
    specialty: "Dermatology",
    qualification: "MBBS, MD",
    experience: 5,
    fee: 400,
  },
];

const appointment = {
  id: "apt-1",
  doctorName: "Dr. Arun",
  patientName: "Demo Patient",
  date: "2099-10-20",
  timeSlot: "10:00 AM",
  status: "Booked",
};

describe("DoctorCard", () => {
  test("displays doctor information", () => {
    render(<DoctorCard doctor={doctor} />);

    expect(screen.getByText("Dr. Arun")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Consultation Fee: ₹500")).toBeInTheDocument();
  });

  test("calls onView when View Details is clicked", async () => {
    const user = userEvent.setup();
    const onView = jest.fn();

    render(<DoctorCard doctor={doctor} onView={onView} />);
    await user.click(screen.getByRole("button", { name: /view details/i }));

    expect(onView).toHaveBeenCalledWith(doctor);
  });
});

describe("DoctorList", () => {
  test("displays doctor cards", () => {
    render(<DoctorList doctors={doctors} />);

    expect(screen.getByText("Dr. Arun")).toBeInTheDocument();
    expect(screen.getByText("Dr. Priya")).toBeInTheDocument();
  });

  test("searches doctors by name", async () => {
    const user = userEvent.setup();
    render(<DoctorList doctors={doctors} />);

    await user.type(screen.getByLabelText(/search doctor/i), "Arun");

    expect(screen.getByText("Dr. Arun")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Priya")).not.toBeInTheDocument();
  });

  test("filters doctors by specialty", async () => {
    const user = userEvent.setup();
    render(<DoctorList doctors={doctors} />);

    await user.selectOptions(
      screen.getByLabelText(/specialty/i),
      "Cardiology"
    );

    expect(screen.getByText("Dr. Arun")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Priya")).not.toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(<DoctorList loading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading doctors..."
    );
  });

  test("shows error state", () => {
    render(<DoctorList error="Unable to load doctors." />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load doctors."
    );
  });

  test("shows message when no doctors match", async () => {
    const user = userEvent.setup();
    render(<DoctorList doctors={doctors} />);

    await user.type(screen.getByLabelText(/search doctor/i), "Unknown");

    expect(screen.getByText("No doctors found.")).toBeInTheDocument();
  });
});

describe("DoctorDetails", () => {
  test("displays details and handles booking click", async () => {
    const user = userEvent.setup();
    const onBook = jest.fn();

    render(<DoctorDetails doctor={doctor} onBook={onBook} />);

    expect(screen.getByText(/Cardiology/)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /book appointment/i })
    );

    expect(onBook).toHaveBeenCalledWith(doctor);
  });

  test("shows error when doctor is missing", () => {
    render(<DoctorDetails doctor={null} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Doctor details not available."
    );
  });
});

describe("AppointmentForm", () => {
  test("submits patient, date, and selected time slot", async () => {
    const user = userEvent.setup();
    const onBook = jest.fn();

    render(<AppointmentForm doctor={doctor} onBook={onBook} />);

    await user.type(screen.getByLabelText(/patient name/i), "Demo Patient");

    fireEvent.change(screen.getByLabelText(/appointment date/i), {
      target: { value: "2099-10-20" },
    });

    await user.selectOptions(
      screen.getByLabelText(/time slot/i),
      "10:00 AM"
    );

    await user.click(
      screen.getByRole("button", { name: /confirm booking/i })
    );

    expect(onBook).toHaveBeenCalledWith({
      doctorId: 101,
      doctorName: "Dr. Arun",
      patientName: "Demo Patient",
      date: "2099-10-20",
      timeSlot: "10:00 AM",
    });
  });

  test("validates required fields", async () => {
    const user = userEvent.setup();
    const onBook = jest.fn();

    render(<AppointmentForm doctor={doctor} onBook={onBook} />);

    await user.click(
      screen.getByRole("button", { name: /confirm booking/i })
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please complete all fields."
    );
    expect(onBook).not.toHaveBeenCalled();
  });

  test("shows booking loading and error states", () => {
    const { rerender } = render(
      <AppointmentForm doctor={doctor} loading />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Booking appointment..."
    );
    expect(
      screen.getByRole("button", { name: /confirm booking/i })
    ).toBeDisabled();

    rerender(
      <AppointmentForm doctor={doctor} error="Booking failed." />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Booking failed.");
  });
});

describe("Appointments", () => {
  test("displays an appointment", () => {
    render(<Appointments appointments={[appointment]} />);

    expect(screen.getByText("Dr. Arun")).toBeInTheDocument();
    expect(screen.getByText(/Demo Patient/)).toBeInTheDocument();
    expect(screen.getByText(/10:00 AM/)).toBeInTheDocument();
  });

  test("calls onCancel with the appointment ID", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <Appointments
        appointments={[appointment]}
        onCancel={onCancel}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /cancel appointment/i })
    );

    expect(onCancel).toHaveBeenCalledWith("apt-1");
  });

  test("shows empty, loading, and error states", () => {
    const { rerender } = render(<Appointments appointments={[]} />);

    expect(screen.getByText("No appointments found.")).toBeInTheDocument();

    rerender(<Appointments loading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading appointments..."
    );

    rerender(<Appointments error="Unable to load appointments." />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load appointments."
    );
  });
});