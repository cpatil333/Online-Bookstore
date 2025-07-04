import React, { useEffect, useState } from "react";
import { UDPATE_USER } from "../../apollo/Mutation";
import { GET_USER_ID } from "../../apollo/Queries";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import "../../styles/common.css";

const EditUser = () => {
  const navigate = useNavigate();
  const param = useParams();
  const userId = parseInt(param.id);
  const [formData, setFormData] = useState({});
  const { data: getUser } = useQuery(GET_USER_ID, {
    variables: {
      getUserById: userId,
    },
  });
  console.log(getUser);
  const [updateUser] = useMutation(UDPATE_USER, {
    onCompleted() {
      navigate("/");
    },
  });

  useEffect(() => {
    if (getUser?.getUserById) {
      setFormData({
        fullName: getUser?.getUserById.fullName,
        email: getUser?.getUserById.email,
        role: getUser?.getUserById.role,
      });
    }
  }, [getUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Check if password is empty
      if (!formData.password || formData.password.trim() === "") {
        alert("Please enter a password");
        return;
      }

      const { data } = await updateUser({
        variables: {
          updateUser: {
            ...formData,
            id: parseInt(param.id),
          },
        },
      });
      if (data?.updateUser) {
        alert("User registered updated successfully!");
      } else {
        alert("User Registration udpated failed.");
      }
    } catch (error) {
      console.error("User Registration udpated Error:", error.message);
      alert("User Registration udpated failed. Check console.");
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
              value={formData.fullName}
              placeholder="Full Name"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
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
            <select
              type="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
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

export default EditUser;
