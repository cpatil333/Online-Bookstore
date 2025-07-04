import React, { useState } from "react";
import "../styles/common.css";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { USER_LOGIN } from "../apollo/Mutation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../utils/Auth/authSlice.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [login] = useMutation(USER_LOGIN, {
    onCompleted(login) {
      navigate("/");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: {
          loginUser: formData,
        },
      });
      console.log(data?.login);
      if (data?.login) {
        dispatch(
          setCredentials({
            user: {
              fullName: data.login.user.fullName,
              role: data.login.user.role,
              userId: data.login.user.id,
            },
            token: data.login.token,
          })
        );
      } else {
        console.log("Invalid login credential!");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <h2>Login</h2>

      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="User Email"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="User Password"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
