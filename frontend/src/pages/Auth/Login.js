import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Register.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        setAuth({
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: res.data.user,
            token: res.data.token,
          })
        );
        toast.success(res.data.message || "Login successful");
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Register"}>
      <div className="register">
        <h1>Login Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail" className="form-label">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email Address"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Strong Password"
              required
            />
          </div>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
          <button type="submit" className="btn btn-primary">
            Login
          </button>{" "}
          <br></br>
          <br></br>
          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/register" className="signup-link">
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
