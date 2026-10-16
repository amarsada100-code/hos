
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hospitalApi = createApi({
  reducerPath: "hospitalApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: () => "doctors",
    }),

    getAppointments: builder.query({
      query: () => "api/appointments",
    }),

    bookAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "api/appointments",
        method: "POST",
        body: appointmentData,
      }),
    }),

    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `api/appointments/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetAppointmentsQuery,
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
} = hospitalApi;

