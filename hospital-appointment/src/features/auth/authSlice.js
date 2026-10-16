import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: localStorage.getItem("token"),
    patient: JSON.parse(localStorage.getItem("patient") || "null")
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.patient = action.payload.patient;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "patient",
        JSON.stringify(action.payload.patient)
      );
    },

    logout: (state) => {
      state.token = null;
      state.patient = null;

      localStorage.removeItem("token");
      localStorage.removeItem("patient");
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;