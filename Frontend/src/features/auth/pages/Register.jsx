import { useState } from "react";
import "../styles/form.scss";
import { Link,useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const {loading,handleRegister} = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      await handleRegister(username, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="Enter username"
          />
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="Enter email"
          />
          <input
            onChange={(e) => {
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
