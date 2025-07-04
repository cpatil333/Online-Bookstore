import React from "react";
import "../../styles/Books.css";
import { useQuery } from "@apollo/client";
import { GET_BOOK_LIST } from "../../apollo/Queries";
import { useLocation, useNavigate } from "react-router-dom";

const Books = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_BOOK_LIST, {
    fetchPolicy: "network-only",
  });
  const token = localStorage.getItem("token") || "";
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("Error ", error.message);
  }
  if (data.books.length === 0) {
    return <p>No Data available!</p>;
  }

  if (!token && path !== "/login" && path !== "/register") {
    navigate("/login");
  }

  return (
    <div className="book-container">
      {data?.books?.map((book) => (
        <div className="book-card" key={book.id}>
          <img src={book.image} alt={book.title} className="book-image" />
          <h3>{book.title}</h3>
          <p>Author: {book.author}</p>
          <p>{book.description}</p>
          <p>₹{book.price}</p>
          <p>Stock: {book.stock}</p>
          <button onClick={() => navigate("/add-book")}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default Books;
