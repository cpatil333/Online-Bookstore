import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDERS_LIST } from "../../apollo/Queries";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/common.css";

const OrderList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (!token && path !== "/login" && path !== "/register") {
    navigate("/login");
  }

  const { data, loading, error } = useQuery(GET_ORDERS_LIST);
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("Error ", error.message);
  }
  if (data.orders.length === 0) {
    return <p>No Data available!</p>;
  }

  return (
    <div className="order-list">
      <h2>Orders</h2>
      {data.orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Order #{order.id}</h3>
          <p>
            <strong>Customer:</strong> {order.user.fullName}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
          </p>
          <table className="order-items">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.book.title}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default OrderList;
