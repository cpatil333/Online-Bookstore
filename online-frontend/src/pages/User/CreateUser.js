import React, { useState } from "react";
import { ADD_USER } from "../../apollo/Mutation";
import { useNavigate } from "react-router-dom";
import { useMutation} from "@apollo/client";
import "../../styles/common.css";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [register] = useMutation(ADD_USER, {
    onCompleted() {
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
      const { data } = await register({
        variables: {
          newUser: formData,
        },
      });
      if (data?.signup) {
        alert("New User registered successfully!");
      } else {
        alert("New User Registration failed.");
      }
    } catch (error) {
      console.error("New User Registration Error:", error.message);
      alert("New User Registration failed. Check console.");
    }
  };

  return (
    <div className="main-container">
      <h2>New User Register</h2>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div>
            <select type="role" name="role" onChange={handleChange}>
              <option value="select">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
