import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>
        This is my blog
        <span className="header-links">
          <Link to="/">Home </Link>
          <Link to="/about-me">About Me </Link>
          <Link to="/new-post">New Post </Link>
        </span>
      </h1>
      <Link to="/login">Login</Link>
    </header>
  );
}

export default Header;
