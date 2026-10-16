import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,

  reducers: {
    bookAppointment: (state, action) => {
      state.items.push({
        id: action.payload.id,
        doctor: action.payload.doctor,
        date: action.payload.date,
        timeSlot: action.payload.timeSlot,
        patientDetails: action.payload.patientDetails,
        status: "Booked"
      });
    },

    rescheduleAppointment: (state, action) => {
      const appointment = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (appointment && appointment.status === "Booked") {
        appointment.date = action.payload.date;
        appointment.timeSlot = action.payload.timeSlot;
        appointment.status = "Rescheduled";
      }
    },

    cancelAppointment: (state, action) => {
      const appointment = state.items.find(
        (item) => item.id === action.payload
      );

      if (
        appointment &&
        ["Booked", "Rescheduled"].includes(appointment.status)
      ) {
        appointment.status = "Cancelled";
      }
    }
  }
});

export const {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment
} = appointmentSlice.actions;

export default appointmentSlice.reducer;