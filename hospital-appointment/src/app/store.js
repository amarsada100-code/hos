
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { hospitalApi } from "./hospitalApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [hospitalApi.reducerPath]: hospitalApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(hospitalApi.middleware),
});
