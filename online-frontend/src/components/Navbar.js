import React from "react";
import "../styles/navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (!token && path !== "/login" && path !== "/register") {
    navigate("/login");
  }
  
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav>
        {token ? (
          <>
            <li>
              <Link to="/" className="link">
                Users
              </Link>
            </li>
            <li>
              <Link to="/book-list" className="link">
                Book
              </Link>
            </li>
            <li>
              <Link to="/order-list" className="link">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/order-items-list" className="link">
                Order Items
              </Link>
            </li>
            <li>
              <Link onClick={logout} className="link">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" className="link">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="link">
                Login
              </Link>
            </li>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
