import { useState } from "react";
import "../styles/form.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister } = useAuth();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const res = await handleRegister(username, email, password);
      console.log("Registration successful", res);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="Enter username"
          />
          <input
            onInput={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="Enter email"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <button type="submit" className="btn primary-btn">
            Register
          </button>
        </form>
        <p>
          Already have an account?
          <Link className="toggleAuthForm" to="/login">
            Login to Account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
