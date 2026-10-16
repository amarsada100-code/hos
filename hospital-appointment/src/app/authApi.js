import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const registerPatient = async (patientData) => {
  const response = await authApi.post("/register", patientData);
  return response.data;
};

export const loginPatient = async (email, password) => {
  const response = await authApi.post("/login", {
    email,
    password
  });

  return response.data;
};