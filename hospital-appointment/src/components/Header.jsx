import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { hospitalApi } from "../app/hospitalApi";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, patient, expiresAt } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated =
    Boolean(token) && Boolean(expiresAt) && expiresAt > Date.now();

  function handleLogout() {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("patient");
    sessionStorage.removeItem("expiresAt");

    dispatch(logout());
    dispatch(hospitalApi.util.resetApiState());

    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <NavLink to="/" className="logo">
        🏥 MediBook
      </NavLink>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/doctors">Find Doctors</NavLink>

        {isAuthenticated && (
          <>
            <NavLink to="/appointments">My Appointments</NavLink>
            <NavLink to="/history">History</NavLink>
            <span className="patient-name">
              Hi, {patient?.name}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!isAuthenticated && (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}