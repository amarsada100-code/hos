import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPatient } from "../app/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerPatient({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });

      navigate("/login", {
        state: {
          registeredEmail: form.email.trim(),
          message: "Account created successfully. Please log in."
        }
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container auth-page">
      <h1>Create Account</h1>
      <p>Register to book and manage your appointments.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <label>Email Address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          placeholder="At least 8 characters"
          required
        />

        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          minLength={8}
          placeholder="Re-enter your password"
          required
        />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </main>
  );
}