import "../App.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function loginUser() {

    const response = await fetch(

      "http://localhost:5000/login",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          email: email,

          password: password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {

      localStorage.setItem(
        "loggedIn",
        true
      );
      localStorage.setItem(
        "token",
        data.token
      );
      localStorage.setItem(
        "userEmail",
        email
      );

      alert("Login Successful");

      navigate("/dashboard");

    } else {

      alert(data.message);
    }
  }

  return (

    <div className="auth-page">

      <div className="auth-box">

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginUser}>
          Login
        </button>
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{
              color: "#4f8cff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;