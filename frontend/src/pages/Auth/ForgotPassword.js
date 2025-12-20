import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Register.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [answer, setAnswer] = useState();
    
      const navigate = useNavigate();
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post("http://localhost:8080/api/v1/auth/forgot-password", {
            email,
            newPassword,
            answer,
          });
          if (res && res.data.success) {
            toast.success(res.data.message || "Password Reset Successful");
            navigate( "/login");
          } else {
            toast.error(res.data.message || "Reset failed");
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      };
  return (
    <Layout title={"Forgot Password"}>
        <div className="register">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
             <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputAnswer1"
              placeholder="Enter your Email Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputAnswer1"
              placeholder="What's your nickname"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter new Password"
              required
            />
          </div>

          
          <button type="submit" className="btn btn-primary">
            Reset
          </button>
        </form>
      </div>
    </Layout>
    
  )
}

export default ForgotPassword;