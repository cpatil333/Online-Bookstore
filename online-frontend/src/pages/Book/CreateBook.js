import React, { useState } from "react";
import { ADD_BOOK } from "../../apollo/Mutation";
import { GET_BOOK_LIST } from "../../apollo/Queries";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import "../../styles/common.css";

const CreateBook = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [bookCart] = useMutation(ADD_BOOK, {
    onCompleted() {
      navigate("/book-list");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadeFileName = "";

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("image", selectedFile);

        try {
          const response = await fetch("http://localhost:4000/uploads", {
            method: "POST",
            body: fileData,
          });

          const contentType = response.headers.get("content-type") || "";

          if (!contentType.includes("application/json")) {
            // only error if it’s *not* JSON
            const text = await response.text();
            throw new Error("Server returned non-JSON: " + text);
          }

          const result = await response.json();
          uploadeFileName = result.filename;
        } catch (error) {
          console.log("uploaded failed ", error.message);
          return;
        }
      }

      const { data } = await bookCart({
        variables: {
          newBook: {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image: uploadeFileName,
          },
        },
        refetchQueries: [{ query: GET_BOOK_LIST }],
      });

      if (data?.addBook) {
        alert("Book Cart added successfully!");
      } else {
        alert("Book Cart failed.");
      }
    } catch (error) {
      console.error("Book Cart added Error:", error.message);
      alert("Book Cart failed. Check console.");
    }
  };

  return (
    <div className="main-container">
      <h2>Book Cart</h2>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="author"
              placeholder="Author"
              onChange={handleChange}
            />
          </div>
          <div>
            <input type="file" name="image" onChange={handleImageChange} />
          </div>
          <div>
            <input
              type="text"
              name="price"
              placeholder="Price"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="stock"
              placeholder="Stock"
              onChange={handleChange}
            />
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
