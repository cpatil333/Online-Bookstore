import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_LIST } from "../apollo/Queries";
import { DELETE_USER } from "../apollo/Mutation";
import "../styles/common.css";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (!token && path !== "/login" && path !== "/register") {
    navigate("/login");
  }

  const { data, loading, error } = useQuery(GET_USER_LIST, {
    fetchPolicy: "network-only",
  });
  const [delUser] = useMutation(DELETE_USER);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("Error ", error.message);
  }
  if (data.users.length === 0) {
    return <p>No Data available!</p>;
  }

  const handleDelete = async (id) => {
    try {
      await delUser({
        variables: {
          deleteUserId: parseInt(id),
        },
      });

      alert("User Deleted!");
    } catch (error) {
      console.error("User Delete failed:", error.message);
      alert("Failed to delete user.");
    }
  };
  if (!data || data.users.length === 0) {
    return <p>No Data available!</p>;
  }
  return (
    <div className="main-container">
      <h2>User Details</h2>
      <div className="sub-container">
        <button className="btnAdd" onClick={() => navigate(`/add-user`)}>
          Add User
        </button>
      </div>

      <table className="sub-container">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btnedit"
                  onClick={() => navigate(`/edit-user/${user.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btndelete"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
