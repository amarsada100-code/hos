import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const getDoctors = async () => {
  const response = await API.get("/doctors");
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await API.get(`/doctors/${id}`);
  return response.data;
};

export const getAvailability = async (doctorId) => {
  const response = await API.get(
    `/availability?doctorId=${doctorId}`
  );
  return response.data;
};