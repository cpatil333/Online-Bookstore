import React, { useEffect, useState } from "react";
import { UDPATE_BOOK } from "../../apollo/Mutation";
import { GET_BOOK_LIST, GET_BOOK_ID } from "../../apollo/Queries";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import "../../styles/common.css";

const EditBook = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});
  const { data: bookIdData } = useQuery(GET_BOOK_ID, {
    variables: {
      bookById: parseInt(params.id),
    },
  });
  const [updateBook] = useMutation(UDPATE_BOOK, {
    onCompleted() {
      navigate("/book-list");
    },
  });

  useEffect(() => {
    if (bookIdData?.bookById) {
      setFormData({
        title: bookIdData.bookById.title,
        author: bookIdData.bookById.author,
        description: bookIdData.bookById.description,
        image: bookIdData.bookById.image,
        price: bookIdData.bookById.price,
        stock: bookIdData.bookById.stock,
      });
    }
  }, [bookIdData]);

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

      const { data } = await updateBook({
        variables: {
          editBook: {
            ...formData,
            id: parseInt(params.id),
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image: uploadeFileName,
          },
        },
        refetchQueries: [{ query: GET_BOOK_LIST }],
      });

      if (data?.updateBook) {
        alert("Book Cart updated successfully!");
      } else {
        alert("Book Cart failed.");
      }
    } catch (error) {
      console.error("Book Cart updated Error:", error.message);
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
              value={formData.title}
              placeholder="Title"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="author"
              value={formData.author}
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
              value={formData.price}
              placeholder="Price"
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="stock"
              value={formData.stock}
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

export default EditBook;
