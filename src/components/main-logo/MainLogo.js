import "./MainLogo.css";
import React from "react";
import { Link } from "react-router-dom";

function MainLogo() {
  return (
    <Link to="/">
      <div className="main-logo">
        <h1 className="emoji">⚽</h1>
        <h2 className="text">
          Football
          <br />
          Dashboard
        </h2>
      </div>
    </Link>
  );
}

export default MainLogo;
