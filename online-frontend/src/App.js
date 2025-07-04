import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import BookList from "./pages/Book/BookList.js";
import OrderList from "./pages/Order/OrderList.js";
import OrderItems from "./pages/OrderItems.js";
import CreateUser from "./pages/User/CreateUser.js";
import EditUser from "./pages/User/EditUser.js";
import CreateBook from "./pages/Book/CreateBook.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-list" element={<BookList />} />
          <Route path="/add-book" element={<CreateBook />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/order-items-list" element={<OrderItems />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-user" element={<CreateUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
