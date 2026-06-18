import { useState } from "react";
import "../styles/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const res = await handleLogin(username, password);
      console.log("Logged in successfully", res);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Enter username or email"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter password"
          />
          <button type="submit" className="btn primary-btn">
            Login
          </button>
        </form>
        <p>
          Don't have an account?
          {/* /we use link tag to navigate to register form */}
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
