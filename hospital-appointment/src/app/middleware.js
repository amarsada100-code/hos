export const appointmentLogger = (store) => (next) => (action) => {
  if (action.type.startsWith("appointments/")) {
    console.log("Appointment Action:", action.type);
    console.log("Action Data:", action.payload);
  }

  const result = next(action);

  if (action.type.startsWith("appointments/")) {
    console.log(
      "Updated Appointments:",
      store.getState().appointments.items
    );
  }

  return result;
};